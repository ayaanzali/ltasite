import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createRecord } from "@/lib/airtable";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName ?? "").trim();
    const lastName = String(body?.lastName ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = body?.phone != null ? String(body.phone) : "";
    const major = body?.major != null ? String(body.major) : "";
    const year = body?.year != null ? String(body.year) : "";
    const gradYear =
      body?.gradYear != null && body.gradYear !== ""
        ? String(body.gradYear)
        : body?.anticipatedGraduation != null
          ? String(body.anticipatedGraduation)
          : "";
    const interestedIn =
      body?.interestedIn != null && body.interestedIn !== ""
        ? String(body.interestedIn)
        : body?.pursuing != null
          ? String(body.pursuing)
          : "";
    const howDidYouHear = body?.howDidYouHear != null ? String(body.howDidYouHear) : "";
    const mockTrial =
      body?.mockTrial != null && body.mockTrial !== ""
        ? String(body.mockTrial)
        : body?.mockTrialInterest != null
          ? String(body.mockTrialInterest)
          : "";
    const linkedinUrl = body?.linkedinUrl != null ? String(body.linkedinUrl).trim() : "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(email, 10);

    const fields: Record<string, unknown> = {
      "First Name": firstName,
      "Last Name": lastName,
      Email: email,
      "Phone Number": phone || "",
      Major: major || "",
      Year: year || "",
      "Grad Year": gradYear || "",
      Pursuing: interestedIn || "",
      "Mock Trial Interest": mockTrial || "",
      "Referral Source": howDidYouHear || "",
      "LinkedIn URL": linkedinUrl || "",
      Approved: false,
      Password: passwordHash,
    };

    let result: { id?: string; error?: string; rawError?: unknown };
    try {
      result = await createRecord("Members", fields);
    } catch (err) {
      console.error("[join] Detailed Error:", err);
      return NextResponse.json(
        { error: "Failed to create member record" },
        { status: 500 }
      );
    }

    if (result.error) {
      console.error("[join] Detailed Error:", result.error, result.rawError ?? "");
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[join] Detailed Error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
