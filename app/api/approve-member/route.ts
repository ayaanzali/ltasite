import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "LTA UTD <onboarding@resend.dev>";
const WEBHOOK_SECRET = process.env.APPROVE_WEBHOOK_SECRET ?? "";

export async function POST(request: Request) {
  // If a secret is configured, require it in the x-webhook-secret header
  if (WEBHOOK_SECRET) {
    const incoming = request.headers.get("x-webhook-secret") ?? "";
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.firstName ?? "").trim();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "email and firstName are required" },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("[approve-member] RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're approved — Welcome to LTA UTD!",
      html: `
        <p>Hi ${firstName},</p>
        <p>Great news — you've been approved as a member of the Law and Trial Association at UTD!</p>
        <p><strong>Access the Member Portal:</strong><br/>
        Head to <a href="https://ltautd.com">ltautd.com</a> and log in with your UTD email to reach the member portal. From there you can view the club directory and connect with other members.</p>
        <p><strong>What to expect as a member:</strong></p>
        <ul>
          <li><strong>Events</strong> — networking nights, speaker panels, and social events throughout the semester</li>
          <li><strong>Mock Trials</strong> — hands-on practice arguing cases alongside fellow pre-law students</li>
          <li><strong>Legal Programming</strong> — workshops and resources to help you navigate the law school application process and legal career paths</li>
        </ul>
        <p>We're glad to have you. If you have any questions, reach out at <a href="mailto:lta.utd@gmail.com">lta.utd@gmail.com</a>.</p>
        <p>— LTA UTD</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[approve-member] error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
