import { NextResponse } from "next/server";
import { fetchEventsFromBase } from "@/lib/airtable";

export async function GET() {
  try {
    const events = await fetchEventsFromBase();
    return NextResponse.json(
      events.map((e) => ({
        id: e.id,
        name: e.name,
        date: e.date,
        description: e.description,
        location: e.location,
        membersOnly: e.membersOnly,
        rsvpOpen: e.rsvpOpen,
        imageUrl: e.imageUrl,
        rsvpUrl: e.rsvpUrl,
      }))
    );
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
