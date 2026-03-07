import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "LTA UTD <onboarding@resend.dev>";

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

    if (RESEND_API_KEY && email) {
      const resend = new Resend(RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to LTA UTD — Next Steps",
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for filling out the join form! We're excited to have you interested in the Law and Trial Association at UTD.</p>
          <p>Here's what to expect next:</p>
          <ul>
            <li>An officer will review your application and you'll typically be approved within <strong>24 hours</strong>.</li>
            <li>Once approved, you'll receive a confirmation and can access the member portal at <a href="https://ltautd.com">ltautd.com</a>.</li>
          </ul>
          <p><strong>Dues are $10</strong> and can be paid via:</p>
          <ul>
            <li><strong>Venmo:</strong> @LTA-UTD</li>
            <li><strong>Zelle:</strong> lta.utd@gmail.com</li>
          </ul>
          <p>If you have any questions in the meantime, feel free to reach out at <a href="mailto:lta.utd@gmail.com">lta.utd@gmail.com</a>.</p>
          <p>— LTA UTD</p>
        `,
      });
      if (emailError) {
        console.error("[join] Resend error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[join] Detailed Error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
