import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { Resend } from "resend";

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

    const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "LTA UTD <onboarding@resend.dev>";
    console.log("[join] email debug — key set:", !!RESEND_API_KEY, "| from:", FROM_EMAIL, "| to:", email);

    if (RESEND_API_KEY && email) {
      console.log("[join] attempting Resend send...");
      const resend = new Resend(RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to LTA UTD — Next Steps",
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for filling out the join form! To complete your membership, pay <strong>$10/year in dues</strong> via Venmo <strong>@LTA-UTD</strong> or Zelle <strong>lta.utd@gmail.com</strong>. An officer will then approve your request and you'll receive access to the member portal.</p>
          <p>As a member, you can expect:</p>
          <ul>
            <li>1-on-1 access to lawyers after every panel</li>
            <li>Eligibility to compete in the Spring Case Competition ($1K prize)</li>
            <li>Apply for Intramural Mock Trial in December (members only)</li>
            <li>Member-only events including Alumni Roundtable</li>
            <li>Direct networking with attorneys, UTD alumni, and law school connections</li>
            <li>First access to LTA opportunities, partnerships, and perks as we grow</li>
          </ul>
          <p>Questions? Reach out at <a href="mailto:lta.utd@gmail.com">lta.utd@gmail.com</a>.</p>
          <p>— LTA UTD</p>
        `,
      });
      if (emailError) {
        console.error("[join] Resend error:", JSON.stringify(emailError));
      } else {
        console.log("[join] Resend send succeeded");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[join] Detailed Error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
