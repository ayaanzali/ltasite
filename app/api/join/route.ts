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
        replyTo: "ltautd@gmail.com",
        to: email,
        subject: "Welcome to LTA UTD: Next Steps",
        html: `
          <p>Hi ${firstName},</p>
          <p>I am excited to welcome you to The Law &amp; Trial Association at UTD! As we hope to establish ourselves as a new organization at UTD, we are formalizing our membership process with the goal of bringing special benefits to LTA members. This year, LTA will host events like:</p>
          <ul>
            <li>Lawyer Panels</li>
            <li>Alumni Networking (members only)</li>
            <li>Debate &amp; Social Nights</li>
            <li>LSAT 101 (members only)</li>
            <li>Case Competitions (members only)</li>
          </ul>
          <p>We want our members to be able to participate in our most important events and be able to network with the speakers we bring to our events. We also want them to be able to participate in our competitions such as Intramural Mock Trial in the fall and another competition we hope to launch this semester. To provide these benefits, we are formally opening LTA membership to all UTD students.</p>
          <p>The only requirement is to:</p>
          <ol>
            <li>Complete the membership form, which you have already done, to receive this email.</li>
            <li>Pay $10 dues by Venmo to <strong>@lta-utd</strong> or Zelle to <strong>ltautd@gmail.com</strong></li>
          </ol>
          <p>Your dues cover membership for the full calendar year. You will be eligible to attend member-only events and apply for our competitions through December. If you already paid LTA dues or signed up for the Intramural Mock Trial last semester, do not pay again. Instead, email <a href="mailto:ltautd@gmail.com">ltautd@gmail.com</a>, and we will process your membership manually.</p>
          <p>After you pay your dues, an officer will review your membership. You will then receive an email granting access to your member portal. There, you can access the member directory and connect with other LTA members.</p>
          <p>You will receive emails when LTA opens RSVPs for events. You will also have the chance to network with speakers at our events. In addition, we will host member-only networking workshops that you can attend.</p>
          <p>If you have any questions about membership or dues, please feel free to contact us at <a href="mailto:ltautd@gmail.com">ltautd@gmail.com</a>. We look forward to having you join The Law &amp; Trial Association at UTD!</p>
          <p>Best,<br>Ayaan Ali<br>LTA President</p>
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
