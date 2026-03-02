import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "LTA UTD <onboarding@resend.dev>";

const BUCKET = "ambassador-resumes";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const utdEmail = String(formData.get("utdEmail") ?? "").trim().toLowerCase();
    const phone = String(formData.get("phone") ?? "").trim();
    const major = String(formData.get("major") ?? "").trim();
    const yearInSchool = String(formData.get("yearInSchool") ?? "").trim();
    const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
    const preLaw = String(formData.get("preLaw") ?? "").trim();
    const availability = String(formData.get("availability") ?? "").trim();
    const ambassadorTeam = String(formData.get("ambassadorTeam") ?? "").trim();
    const whyJoin = String(formData.get("whyJoin") ?? "").trim();
    const howContribute = String(formData.get("howContribute") ?? "").trim();
    const skillsExperience = String(formData.get("skillsExperience") ?? "").trim();
    const officerInterest = String(formData.get("officerInterest") ?? "").trim();
    const officerRole = String(formData.get("officerRole") ?? "").trim();

    if (!utdEmail.endsWith("@utdallas.edu")) {
      return NextResponse.json(
        { error: "Email must end in @utdallas.edu" },
        { status: 400 }
      );
    }

    const file = formData.get("resume") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Resume (PDF) is required" },
        { status: 400 }
      );
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Resume must be 5MB or smaller" },
        { status: 400 }
      );
    }

    let resumeUrl = "";
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = "pdf";
      const path = `${Date.now()}-${firstName}-${lastName}.${ext}`.replace(/\s+/g, "-");
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: "application/pdf", upsert: false });
      if (error) {
        console.error("[ambassadors] Supabase upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload resume" },
          { status: 500 }
        );
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      resumeUrl = urlData.publicUrl;
    }

    const airtableResult = await createRecord("Ambassadors", {
      "First Name": firstName,
      "Last Name": lastName,
      "UTD Email": utdEmail,
      "Phone Number": phone,
      Major: major,
      "Year in School": yearInSchool,
      "LinkedIn URL": linkedinUrl,
      "Resume URL": resumeUrl,
      "Pre-Law": preLaw,
      Availability: availability,
      "Ambassador Team": ambassadorTeam,
      "Why Join": whyJoin,
      "How Contribute": howContribute,
      "Skills Experience": skillsExperience,
      "Officer Interest": officerInterest,
      "Officer Role": officerRole,
      "Date Submitted": new Date().toISOString().slice(0, 10),
    });

    if (airtableResult.error) {
      console.error("[ambassadors] Airtable error:", airtableResult.error);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    if (RESEND_API_KEY && utdEmail) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: utdEmail,
        subject: "LTA Ambassador Application Received",
        html: `
          <p>Hi ${firstName},</p>
          <p>We've received your LTA Ambassador application. We'll review it within 1–2 weeks and reach out to schedule an interview if you're a fit.</p>
          <p>Questions? Email lta.utd@gmail.com</p>
          <p>— LTA UTD</p>
        `,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[ambassadors] apply error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
