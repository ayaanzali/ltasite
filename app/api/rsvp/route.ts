import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const eventId = body?.eventId != null ? String(body.eventId) : "";
    const eventName = body?.eventName != null ? String(body.eventName) : "";

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { error: "Name, email, and event ID are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    const result = await createRecord("Event RSVPs", {
      Name: name,
      Email: email,
      "Event ID": eventId,
      "Event Name": eventName,
      Timestamp: timestamp,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
