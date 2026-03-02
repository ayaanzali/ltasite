/**
 * Seeds the lta-chatbot Pinecone index with FAQ chunks.
 * Run from project root: node scripts/seed-pinecone.js
 * Requires PINECONE_API_KEY and PINECONE_INDEX_HOST in .env.local (or environment).
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });

// One-time fallback if .env.local was not loaded (e.g. wrong cwd)
if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_HOST) {
  process.env.PINECONE_API_KEY = process.env.PINECONE_API_KEY || "pcsk_66an8U_G4Z6V8oCTcWN2WBecy69mwiB1nihnHXoBRncai1hKy1zkDqoP8sa9vaqhyQNxD7";
  process.env.PINECONE_INDEX_HOST = process.env.PINECONE_INDEX_HOST || "lta-chatbot-z03lijm.svc.aped-4627-b74a.pinecone.io";
}

const FAQ_CONTENT = `---BEGIN FAQ---
The Law & Trial Association at UTD (LTA) is a student organization founded in January 
2025 that gives UTD students a genuine first look into the legal world through mock trial 
competitions, lawyer panels, LSAT prep workshops, and networking events. LTA has 80+ 
active members. Meetings are held once a month on campus.

LTA is open to every UTD student with no GPA, major, or year requirements. The one time 
membership fee is $10. To join, submit an application at ltautd.com. You will receive 
an email with payment instructions. Once dues are confirmed an officer approves your 
application and you receive a welcome email with member portal login instructions. 
Members get access to all exclusive events, mock trial competitions, and the member portal.

The member portal lets members view their profile and connect with other LTA members. 
Login is via Google or LinkedIn or password. Issues: email lta.utd@gmail.com.

Ambassador program: Ambassadors are active members who help plan and run LTA events. 
They work directly with officers, are rated on performance, and top ambassadors are 
considered for officer positions. To apply, use the ambassador application form at 
ltautd.com/ambassadors. Must be an active paid member first. Executive Director reviews 
and approves ambassador applications. Teams: Events, Marketing, Outreach, Media, 
Fundraising. Email lta.utd@gmail.com with questions.

Past events: In Spring 2025 LTA hosted its premiere Lawyer Panel with 5 DFW attorneys 
and law firm founders plus Professor Betanzos from UTD. In December 2025 LTA hosted the 
2025 Intramural Mock Trial Competition — the first of its kind at UTD. UTD students 
competed as attorneys in a real Texas courtroom judged by practicing attorneys. 5+ DFW 
high schools sent students as witnesses. Winning team: Dorsa Zilaee, Likhit Kadiam, 
Rashmi Ravindran. Runner up: Khadijah Khalid, Aadharshini Thangapandian. 
Member exclusive event.

Event types: Mock Trial Labs, Lawyer Panels, LSAT Prep Workshops, Networking Mixers. 
3+ events per semester. Most are member exclusive. Sign up info sent via email.

Executive Board: Ayaan Ali (President), Ram Sundararaman (Vice President), Dorsa Zilaee 
(Executive Director), Tanisha Dossa (Secretary), Amrita Singh (Treasurer).
Directors: Aishah Abdullah (Programming), Nethra Kartheeswaran (Marketing Co-Director), 
Aafiya Vahora (Marketing Co-Director), Aaryan Merchant (Media Co-Director), Varad 
Kulkarni (Media Co-Director), Neha Kandi (Events), Mohamad Alsafi (Fundraising), 
Khadijah Khalid (Outreach), Aaradhya Arkatkar (Growth).

Contact: lta.utd@gmail.com. Website: ltautd.com.

To compete in mock trial: must be active member with dues paid. No prior experience 
required. Sign up when competition is announced via email.
---END FAQ---`;

function chunkText(text, maxChars = 400) {
  const raw = text.replace(/---BEGIN FAQ---|---END FAQ---/g, "").trim();
  const sentences = raw.split(/(?<=[.\n])\s*/);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if (current.length + s.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = "";
    }
    current += (current ? " " : "") + s;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function main() {
  const { Pinecone } = require("@pinecone-database/pinecone");

  const apiKey = process.env.PINECONE_API_KEY;
  const indexHost = process.env.PINECONE_INDEX_HOST;
  if (!apiKey || !indexHost) {
    console.error("Missing PINECONE_API_KEY or PINECONE_INDEX_HOST. Set in .env.local or environment.");
    process.exit(1);
  }

  console.log("Splitting FAQ into chunks (~400 chars on sentence boundaries)...");
  const chunks = chunkText(FAQ_CONTENT);
  console.log("Chunks:", chunks.length);

  const pc = new Pinecone({ apiKey });
  console.log("Embedding all chunks with llama-text-embed-v2...");
  const embedResult = await pc.inference.embed({
    model: "llama-text-embed-v2",
    inputs: chunks,
    parameters: { inputType: "passage", truncate: "END" },
  });

  const records = embedResult.data.map((item, i) => ({
    id: `chunk-${i}`,
    values: item.values,
    metadata: { text: chunks[i] },
  }));

  const index = pc.index({ host: indexHost });
  console.log("Upserting to index lta-chatbot (host:", indexHost, ")...");
  await index.upsert({
    records,
  });

  console.log("Done. Upserted", records.length, "vectors.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
