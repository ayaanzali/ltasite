import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName ?? "").trim();
    const email = String(body?.email ?? "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const result = await createRecord("Notification Signups", {
      "First Name": firstName,
      Email: email,
      "Date Signed Up": todayISO(),
    });

    if (result.error) {
      console.error("[notify] Airtable createRecord error:", result.error);
      if (result.error === "Airtable not configured") {
        return NextResponse.json(
          { error: "Server misconfigured (missing Airtable env)" },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("[notify] Full error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
