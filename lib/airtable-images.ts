/**
 * Fetch website images from Airtable "Website Images" base.
 * Set AIRTABLE_IMAGES_BASE_ID in .env.local (can use same AIRTABLE_API_KEY).
 *
 * Table: "Images" with columns: Name (text), Image (attachment)
 * Records: Hero1..Hero12, Bottom1..Bottom5, Gallery1, Gallery2, OfficerAyaan, etc., Logo
 */

const Airtable = require("airtable");

const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const IMAGES_BASE_ID = process.env.AIRTABLE_IMAGES_BASE_ID ?? "";

export type WebsiteImages = {
  Hero1?: string;
  Hero2?: string;
  Hero3?: string;
  Hero4?: string;
  Hero5?: string;
  Hero6?: string;
  Hero7?: string;
  Hero8?: string;
  Hero9?: string;
  Hero10?: string;
  Hero11?: string;
  Hero12?: string;
  Bottom1?: string;
  Bottom2?: string;
  Bottom3?: string;
  Bottom4?: string;
  Bottom5?: string;
  Gallery1?: string;
  Gallery2?: string;
  OfficerAyaan?: string;
  OfficerRam?: string;
  OfficerTanisha?: string;
  OfficerAishah?: string;
  OfficerNethra?: string;
  OfficerAafiya?: string;
  OfficerNeha?: string;
  OfficerKhadijah?: string;
  Logo?: string;
};

const FALLBACK: WebsiteImages = {
  Hero1: "/starting-photos/1.JPG",
  Hero2: "/starting-photos/2.JPG",
  Hero3: "/starting-photos/3.JPG",
  Hero4: "/starting-photos/4.JPG",
  Hero5: "/starting-photos/5.JPG",
  Hero6: "/starting-photos/6.JPG",
  Hero7: "/starting-photos/7.JPG",
  Hero8: "/starting-photos/8.JPG",
  Hero9: "/starting-photos/9.JPG",
  Hero10: "/starting-photos/10.JPG",
  Hero11: "/starting-photos/11.JPG",
  Hero12: "/starting-photos/12.JPG",
  Bottom1: "/bottom-section-photos/1.PNG",
  Bottom2: "/bottom-section-photos/2.PNG",
  Bottom3: "/bottom-section-photos/4.PNG",
  Bottom4: "/bottom-section-photos/5.PNG",
  Bottom5: "/bottom-section-photos/6.PNG",
  Gallery1: "/competition-photos/1.JPG",
  Gallery2: "/competition-photos/2.JPG",
  OfficerAyaan: "/images/Ayaan.JPG",
  OfficerRam: "/images/Ram.JPG",
  OfficerTanisha: "/images/Tanisha.JPG",
  OfficerAishah: "/images/Aishah.png",
  OfficerNethra: "/images/Nethra.JPG",
  OfficerAafiya: "/images/Aafiya.png",
  OfficerNeha: "/images/Neha.JPG",
  OfficerKhadijah: "/images/Khadijah.JPG",
  Logo: "/lta-logo.png",
};

export async function fetchWebsiteImages(): Promise<WebsiteImages> {
  if (!API_KEY || !IMAGES_BASE_ID) {
    return FALLBACK;
  }
  try {
    const base = new Airtable({ apiKey: API_KEY }).base(IMAGES_BASE_ID);
    const table = base("Images") as {
      select: () => { eachPage: (page: (r: AirtableRecord[], fn: () => void) => void, done: (err?: Error) => void) => void };
    };
    type AirtableRecord = { get: (f: string) => unknown; fields: Record<string, unknown> };
    const all: AirtableRecord[] = [];
    return new Promise((resolve) => {
      table
        .select()
        .eachPage(
          (records, fetchNextPage) => {
            all.push(...records);
            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error("[airtable-images] fetch error:", err);
              resolve(FALLBACK);
              return;
            }
            const result: WebsiteImages = { ...FALLBACK };
            for (const r of all) {
              const name = (r.get("Name") as string) ?? (r.fields["Name"] as string);
              const attachment = (r.fields["Image"] as Array<{ url?: string }>) ?? (r.get("Image") as Array<{ url?: string }>);
                const url = (Array.isArray(attachment) ? attachment[0] : undefined)?.url;
              if (name && url) {
                (result as Record<string, string>)[name] = url;
              }
            }
            resolve(result);
          }
        );
    });
  } catch (e) {
    console.error("[airtable-images] error:", e);
    return FALLBACK;
  }
}
