import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Pinecone } from "@pinecone-database/pinecone";
import { createRecord, updateRecord } from "@/lib/airtable";

const SYSTEM_PROMPT_TEMPLATE = `You are the official AI assistant for the Law & Trial Association at UTD (LTA).

TONE: Professional, direct, and concise. Do NOT use flowery language like "making history" or "premier organization." Just state the facts from the context.
LENGTH: Keep all answers under 60 words.
VALIDATION: Only answer questions using the provided LTA context. If asked something outside LTA, say you can only help with LTA questions and suggest lta.utd@gmail.com.

LEAD CAPTURE — Follow this flow exactly on every new conversation:
- When leadCaptured is false and conversationHistory has 0 prior assistant messages: 
  respond ONLY with: "I'd love to help! What's your first name?"
- When leadCaptured is false and the last user message looks like a name (not an email): 
  respond ONLY with: "Great [name]! What is your UTD email address? (Please use your @utdallas.edu email)."
- When leadCaptured is false and the last user message looks like an email address: 
  respond ONLY with: "Perfect, thank you [name]! [Answer their original question from the first message using the context below. Keep under 60 words.] How else can I help you?"
- When leadCaptured is true: answer the question using context. End with "How else can I help you?" Keep answers under 60 words.

LTA CONTEXT:
{{CONTEXT}}

Current state for this turn: leadCaptured={{LEAD_CAPTURED}}, number of prior assistant messages in conversationHistory={{PRIOR_ASSISTANT_COUNT}}. The last user message is the one you are responding to. Follow the LEAD CAPTURE rules above exactly based on this state.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function looksLikeName(s: string): boolean {
  const t = s.trim();
  return t.length > 0 && t.length < 80 && !t.includes("@") && !/^\d+$/.test(t);
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const pineconeKey = process.env.PINECONE_API_KEY;
  const indexHost = process.env.PINECONE_INDEX_HOST;

  if (!apiKey) {
    return NextResponse.json({ error: "Chat not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      leadCaptured = false,
      leadName = null,
      leadRecordId = null,
    } = body as {
      message: string;
      conversationHistory: ChatMessage[];
      leadCaptured: boolean;
      leadName: string | null;
      leadRecordId: string | null;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    let context = "";
    if (pineconeKey && indexHost) {
      const pc = new Pinecone({ apiKey: pineconeKey });
      const embedResult = await pc.inference.embed({
        model: "llama-text-embed-v2",
        inputs: [message],
        parameters: { inputType: "passage", truncate: "END" },
      });
      const queryVector = (embedResult.data?.[0] as any)?.values;
      if (queryVector) {
        const index = pc.index<{ text?: string }>({ host: indexHost });
        const queryResponse = await index.query({
          vector: queryVector,
          topK: 3,
          includeMetadata: true,
        });
        const parts = (queryResponse.matches || [])
          .map((m) => m.metadata?.text)
          .filter(Boolean) as string[];
        context = parts.join("\n\n");
      }
    }
    if (!context) context = "No retrieved context available.";

    const priorAssistantCount = conversationHistory.filter(
      (m) => m.role === "assistant"
    ).length;
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
      "{{CONTEXT}}",
      context
    )
      .replace("{{LEAD_CAPTURED}}", String(leadCaptured))
      .replace("{{PRIOR_ASSISTANT_COUNT}}", String(priorAssistantCount));

    const anthropic = new Anthropic({ apiKey });
    const messages: { role: "user" | "assistant"; content: string }[] =
      conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply =
      textBlock && "text" in textBlock ? textBlock.text : "";

    let leadJustCaptured = false;
    let capturedName: string | null = null;
    let newLeadRecordId: string | null = null;

    const lastUserMessage = message.trim();
    const source = "LTA Chatbot";
    const dateSignedUp = new Date().toLocaleDateString();
    const firstMessage = conversationHistory[0]?.role === "user" ? conversationHistory[0].content : "";

    const hasAirtableEnv = !!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID);
    if (!hasAirtableEnv) {
      console.warn("[chat] Airtable not configured: AIRTABLE_API_KEY or AIRTABLE_BASE_ID missing. Set in .env.local and restart the dev server.");
    }

    if (!leadCaptured) {
      const priorAssistantCount = conversationHistory.filter((m) => m.role === "assistant").length;
      if (
        looksLikeName(lastUserMessage) &&
        !looksLikeEmail(lastUserMessage) &&
        priorAssistantCount >= 1
      ) {
        const firstName = lastUserMessage.split(/\s+/).filter(Boolean)[0] ?? lastUserMessage;
        const createPayload = {
          "First Name": firstName,
          "Source": source,
          "Date Signed Up": dateSignedUp,
          "First Message": firstMessage,
        };
        console.log("[chat] Airtable payload (create):", createPayload);
        try {
          const result = await createRecord("Notification Signups", createPayload);
          if (result.id) {
            newLeadRecordId = result.id;
            console.log("[chat] Airtable success (create):", result.id);
          } else if (result.error) {
            console.error("[chat] Airtable createRecord error:", result.error);
          }
        } catch (airtableErr) {
          console.error("[chat] Airtable createRecord failed:", airtableErr);
        }
        capturedName = firstName;
      } else if (
        looksLikeEmail(lastUserMessage) &&
        leadRecordId &&
        conversationHistory.length >= 2
      ) {
        const firstAssistantIdx = conversationHistory.findIndex((m) => m.role === "assistant");
        const nameMessage =
          firstAssistantIdx >= 0 && firstAssistantIdx < conversationHistory.length - 1
            ? conversationHistory[firstAssistantIdx + 1]
            : null;
        const name = nameMessage?.role === "user" ? nameMessage.content.trim() : "";
        if (name && looksLikeName(name)) {
          const updatePayload = {
            "Email": lastUserMessage,
            "Date Signed Up": dateSignedUp,
          };
          console.log("[chat] Airtable payload (update):", updatePayload);
          try {
            const updateResult = await updateRecord("Notification Signups", leadRecordId, updatePayload);
            if (updateResult.error) {
              console.error("[chat] Airtable updateRecord error:", updateResult.error);
            } else {
              console.log("[chat] Airtable success (update): record", leadRecordId);
            }
          } catch (airtableErr) {
            console.error("[chat] Airtable updateRecord failed:", airtableErr);
          }
          leadJustCaptured = true;
          capturedName = name.split(/\s+/).filter(Boolean)[0] ?? name;
        }
      }
    }

    return NextResponse.json({
      reply,
      leadJustCaptured,
      capturedName,
      leadRecordId: newLeadRecordId ?? leadRecordId,
    });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
