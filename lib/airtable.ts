/**
 * Shared Airtable client. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env.local
 */

const Airtable = require("airtable");

const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

function getBase(): ReturnType<typeof Airtable.prototype.base> | null {
  if (!API_KEY || !BASE_ID) return null;
  return new Airtable({ apiKey: API_KEY }).base(BASE_ID);
}

export async function createRecord(
  table: string,
  fields: Record<string, unknown>
): Promise<{ id?: string; error?: string; rawError?: unknown }> {
  const base = getBase();
  if (!base) return { error: "Airtable not configured" };
  try {
    const records = (await (base(table) as { create: (data: unknown[]) => Promise<{ id: string }[]> }).create([
      { fields },
    ])) as { id: string }[];
    const record = records?.[0];
    return record ? { id: record.id } : { error: "No record returned" };
  } catch (e) {
    console.error("[airtable] createRecord full error:", e);
    return {
      error: e instanceof Error ? e.message : "Request failed",
      rawError: e,
    };
  }
}

export async function updateRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<{ error?: string }> {
  const base = getBase();
  if (!base) return { error: "Airtable not configured" };
  try {
    const tableApi = base(table) as { update: (id: string, fields: Record<string, unknown>) => Promise<unknown> };
    await tableApi.update(recordId, fields);
    return {};
  } catch (e) {
    console.error("[airtable] updateRecord error:", e);
    return { error: e instanceof Error ? e.message : "Update failed" };
  }
}

export type EventRecord = {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  membersOnly: boolean;
  rsvpOpen: boolean;
  imageUrl?: string;
  rsvpUrl?: string;
};

type AirtableRecord = { id: string; get: (field: string) => unknown; fields: Record<string, unknown> };

export async function fetchEventsFromBase(): Promise<EventRecord[]> {
  const base = getBase();
  if (!base) return [];
  try {
    const table = base("Events") as {
      select: (opts?: { sort?: { field: string; direction: string }[] }) => {
        eachPage: (
          page: (records: AirtableRecord[], fetchNextPage: () => void) => void,
          done: (err?: Error) => void
        ) => void;
      };
    };
    const all: AirtableRecord[] = [];
    return new Promise((resolve, reject) => {
      table
        .select({ sort: [{ field: "Date", direction: "asc" }] })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            all.push(...pageRecords);
            fetchNextPage();
          },
          (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(
              all.map((r) => {
                const fields = r.fields as Record<string, unknown>;
                const eventImage = fields["Event Image"] as Array<{ url?: string }> | undefined;
                const imageUrl = eventImage?.[0]?.url;
                const rsvpUrl = (fields["RSVP Link"] as string) ?? (r.get("RSVP Link") as string) ?? "";
                const memberExclusive =
                  Boolean(fields["Member Exclusive"]) || Boolean(r.get("Member Exclusive")) || Boolean(r.get("Members Only"));
                return {
                  id: r.id,
                  name: (r.get("Event Name") as string) ?? (r.get("Name") as string) ?? "Event",
                  date: (r.get("Date") as string) ?? "",
                  description: (r.get("Description") as string) ?? "",
                  location: (r.get("Location") as string) ?? "",
                  membersOnly: memberExclusive,
                  rsvpOpen: Boolean(r.get("RSVP Open")),
                  imageUrl: imageUrl || undefined,
                  rsvpUrl: (typeof rsvpUrl === "string" && rsvpUrl.trim()) || undefined,
                };
              })
            );
          }
        );
    });
  } catch {
    return [];
  }
}

export type MemberRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  gradYear: string;
  linkedinUrl: string;
  passwordHash: string;
  approved: boolean;
  /** Raw value from Airtable for debugging */
  rawApproved: unknown;
};

export type ApprovedMember = {
  id: string;
  name: string;
  email: string;
  clerkUserId: string;
  major: string;
  gradYear: string;
  linkedinUrl: string;
};

function isApprovedValue(val: unknown): boolean {
  return (
    val === true ||
    val === 1 ||
    String(val).toLowerCase() === "true"
  );
}

function recordToMember(r: AirtableRecord): MemberRecord {
  const firstName = (r.get("First Name") as string) ?? "";
  const lastName = (r.get("Last Name") as string) ?? "";
  const rawApproved = r.get("Approved");
  return {
    id: r.id,
    firstName,
    lastName,
    email: (r.get("Email") as string) ?? "",
    major: (r.get("Major") as string) ?? "",
    gradYear: (r.get("Grad Year") as string) ?? "",
    linkedinUrl: (r.get("LinkedIn URL") as string) ?? "",
    passwordHash: (r.get("Password") as string) ?? "",
    approved: isApprovedValue(rawApproved),
    rawApproved,
  };
}

const MEMBERS_TABLE = "Members";
const CLERK_USER_ID_FIELD = "Clerk User ID";

export async function getMemberByEmail(email: string): Promise<MemberRecord | null> {
  const base = getBase();
  if (!base) return null;
  const normalized = email.trim().toLowerCase();
  const table = base(MEMBERS_TABLE) as {
    select: (opts: { filterByFormula: string; maxRecords: number }) => {
      firstPage: (cb: (err?: Error, records?: AirtableRecord[]) => void) => void;
    };
  };
  const escaped = normalized.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return new Promise((resolve) => {
    table
      .select({ filterByFormula: `LOWER({Email}) = "${escaped}"`, maxRecords: 1 })
      .firstPage((err, records) => {
        if (err || !records?.length) {
          resolve(null);
          return;
        }
        resolve(recordToMember(records[0]));
      });
  });
}

export async function getMemberByClerkUserId(clerkUserId: string): Promise<MemberRecord | null> {
  const base = getBase();
  if (!base || !clerkUserId) return null;
  const table = base(MEMBERS_TABLE) as {
    select: (opts: { filterByFormula: string; maxRecords: number }) => {
      firstPage: (cb: (err?: Error, records?: AirtableRecord[]) => void) => void;
    };
  };
  const escaped = clerkUserId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const formula = `AND({${CLERK_USER_ID_FIELD}} = "${escaped}", {Approved} = 1)`;
  return new Promise((resolve) => {
    table
      .select({ filterByFormula: formula, maxRecords: 1 })
      .firstPage((err, records) => {
        if (err || !records?.length) {
          resolve(null);
          return;
        }
        resolve(recordToMember(records[0]));
      });
  });
}

export async function updateMemberClerkUserId(
  recordId: string,
  clerkUserId: string
): Promise<{ error?: string }> {
  const base = getBase();
  if (!base) return { error: "Airtable not configured" };
  try {
    const table = base(MEMBERS_TABLE) as { update: (id: string, fields: Record<string, unknown>) => Promise<unknown> };
    await table.update(recordId, { [CLERK_USER_ID_FIELD]: clerkUserId });
    return {};
  } catch (e) {
    console.error("[airtable] updateMemberClerkUserId error:", e);
    return { error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function getApprovedMembers(): Promise<ApprovedMember[]> {
  const base = getBase();
  if (!base) return [];
  const table = base("Members") as {
    select: (opts: { filterByFormula: string }) => {
      eachPage: (
        page: (records: AirtableRecord[], fetchNextPage: () => void) => void,
        done: (err?: Error) => void
      ) => void;
    };
  };
  return new Promise((resolve, reject) => {
    const all: AirtableRecord[] = [];
    table
      .select({ filterByFormula: "{Approved} = 1" })
      .eachPage(
        (pageRecords, fetchNextPage) => {
          all.push(...pageRecords);
          fetchNextPage();
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(
            all.map((r) => {
              const m = recordToMember(r);
              const clerkUserId = (r.get(CLERK_USER_ID_FIELD) as string) ?? "";
              return {
                id: m.id,
                name: [m.firstName, m.lastName].filter(Boolean).join(" ") || "Member",
                email: m.email,
                clerkUserId: clerkUserId.trim(),
                major: m.major,
                gradYear: m.gradYear,
                linkedinUrl: m.linkedinUrl,
              };
            })
          );
        }
      );
  });
}
