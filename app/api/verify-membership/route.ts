import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMemberByEmail, updateMemberClerkUserId } from "@/lib/airtable";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { utdEmail?: string; clerkUserId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const utdEmail = typeof body?.utdEmail === "string" ? body.utdEmail.trim() : "";
  const clerkUserId = typeof body?.clerkUserId === "string" ? body.clerkUserId.trim() : "";

  if (!utdEmail || !clerkUserId) {
    return NextResponse.json({ error: "utdEmail and clerkUserId required" }, { status: 400 });
  }

  if (clerkUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const member = await getMemberByEmail(utdEmail);
  if (!member || !member.approved) {
    return NextResponse.json(
      { error: "No approved membership found for that email" },
      { status: 404 }
    );
  }

  const result = await updateMemberClerkUserId(member.id, clerkUserId);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
