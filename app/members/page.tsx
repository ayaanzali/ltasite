import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkUserId } from "@/lib/airtable";
import { MembersContent } from "./MembersContent";

export default async function MembersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkUserId(userId);
  if (!member || !member.approved) redirect("/verify-membership");

  return <MembersContent />;
}
