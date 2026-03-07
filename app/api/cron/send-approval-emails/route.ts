import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPendingApprovalMembers, updateRecord } from "@/lib/airtable";

export async function GET(request: Request) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "LTA UTD <onboarding@resend.dev>";
  const CRON_SECRET = process.env.CRON_SECRET ?? "";

  // Vercel cron jobs call GET and pass Authorization: Bearer <CRON_SECRET>
  if (CRON_SECRET) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!RESEND_API_KEY) {
    console.error("[cron/approval] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const pending = await getPendingApprovalMembers();

  if (pending.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const errors: string[] = [];
  let sent = 0;

  for (const member of pending) {
    if (!member.email) {
      errors.push(`Record ${member.id}: missing email`);
      continue;
    }

    try {
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: member.email,
        subject: "You're approved — Welcome to LTA UTD!",
        html: `
          <p>Hi ${member.firstName},</p>
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

      if (emailError) throw new Error(emailError.message);
      await updateRecord("Members", member.id, { "Approval Email Sent": true });
      sent++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[cron/approval] Failed for ${member.email}:`, msg);
      errors.push(`${member.email}: ${msg}`);
    }
  }

  return NextResponse.json({ sent, errors: errors.length ? errors : undefined });
}
