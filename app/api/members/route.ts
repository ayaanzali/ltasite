import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getApprovedMembers } from "@/lib/airtable";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  try {
    const members = await getApprovedMembers();
    const client = await clerkClient();

    const needsEmailFallback = members.some((m) => !m.clerkUserId && m.email);
    let emailToImageUrl = new Map<string, string>();
    if (needsEmailFallback) {
      let offset = 0;
      const limit = 100;
      let hasMore = true;
      while (hasMore) {
        const { data: users } = await client.users.getUserList({ limit, offset });
        for (const u of users) {
          const primaryEmail = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress
            ?? u.emailAddresses[0]?.emailAddress;
          if (primaryEmail) {
            emailToImageUrl.set(primaryEmail.trim().toLowerCase(), u.imageUrl);
          }
        }
        hasMore = users.length === limit;
        offset += users.length;
      }
    }

    const withPhotos = await Promise.all(
      members.map(async (m) => {
        let imageUrl: string | undefined;
        if (m.clerkUserId) {
          try {
            const user = await client.users.getUser(m.clerkUserId);
            imageUrl = user.imageUrl;
          } catch {
            imageUrl = undefined;
          }
        }
        if (imageUrl === undefined && m.email) {
          imageUrl = emailToImageUrl.get(m.email.trim().toLowerCase());
        }
        const { email: _email, clerkUserId: _cid, ...rest } = m;
        return { ...rest, imageUrl };
      })
    );

    return NextResponse.json(withPhotos);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
