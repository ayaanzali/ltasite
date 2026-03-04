/**
 * Fetch website images from Airtable. Uses Section (folder) + Name (filename) to map
 * to local paths like /images/Ayaan.JPG or /competition-photos/1.JPG.
 *
 * Table: Name, Section, Picture (attachment)
 * Base ID: appcpycTwtluUN3Fq
 * Table ID: tblOMpFxnkRwxfuEE
 */

const Airtable = require("airtable");

/** TEMP: Hardcode token to test if env loading is the issue. Paste your Airtable personal access token below.
 *  Once images load, remove this and use process.env.AIRTABLE_API_KEY only. */
const HARDCODED_TOKEN_FOR_TEST = ""; // <-- Paste your token here for testing
const API_KEY = HARDCODED_TOKEN_FOR_TEST || process.env.AIRTABLE_API_KEY ?? "";
const IMAGES_BASE_ID = process.env.AIRTABLE_IMAGES_BASE_ID ?? "appcpycTwtluUN3Fq";
const IMAGES_TABLE_ID = process.env.AIRTABLE_IMAGES_TABLE_ID ?? "tblOMpFxnkRwxfuEE";

function logEnvVars() {
  console.log("[airtable-images] Env vars read: AIRTABLE_API_KEY, AIRTABLE_IMAGES_BASE_ID, AIRTABLE_IMAGES_TABLE_ID");
  console.log("[airtable-images] AIRTABLE_API_KEY:", process.env.AIRTABLE_API_KEY ? `set (length=${process.env.AIRTABLE_API_KEY.length})` : "empty/undefined");
  console.log("[airtable-images] AIRTABLE_IMAGES_BASE_ID:", process.env.AIRTABLE_IMAGES_BASE_ID ? `set (${process.env.AIRTABLE_IMAGES_BASE_ID})` : "empty/undefined, using default");
  console.log("[airtable-images] AIRTABLE_IMAGES_TABLE_ID:", process.env.AIRTABLE_IMAGES_TABLE_ID ? `set (${process.env.AIRTABLE_IMAGES_TABLE_ID})` : "empty/undefined, using default");
  console.log("[airtable-images] Resolved: baseId=", IMAGES_BASE_ID, "tableId=", IMAGES_TABLE_ID);
}

type ImageMap = Record<string, string>;

let cachedImages: ImageMap | null = null;

function buildKey(section: string, name: string): string {
  return section ? `${section}/${name}` : name;
}

/** Logo is the only image kept in public; use it when Airtable has no logo record */
const LOGO_FALLBACK = "/lta-logo.png";

/** Strip extension from filename (e.g. "1.JPG" -> "1", "lta-logo.png" -> "lta-logo") */
function getBaseName(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

/** Parse stored key into section and name */
function parseKey(key: string): { section: string; name: string } {
  const i = key.indexOf("/");
  if (i === -1) return { section: "", name: key };
  return { section: key.slice(0, i), name: key.slice(i + 1) };
}

/** Find URL by section + base name (extension-agnostic, case-insensitive) */
function findByBaseName(images: ImageMap, section: string, name: string): string | undefined {
  const reqSectionNorm = section.trim().toLowerCase();
  const reqBaseNorm = getBaseName(name).toLowerCase();
  if (!reqBaseNorm) return undefined;
  for (const [key, url] of Object.entries(images)) {
    const { section: s, name: n } = parseKey(key);
    if (s.toLowerCase() !== reqSectionNorm) continue;
    if (getBaseName(n).toLowerCase() === reqBaseNorm) return url;
  }
  return undefined;
}

export async function fetchWebsiteImages(): Promise<ImageMap> {
  logEnvVars();
  if (cachedImages) return cachedImages;
  if (!API_KEY) {
    console.log("[airtable-images] Skipping fetch: AIRTABLE_API_KEY is empty");
    cachedImages = {};
    return cachedImages;
  }
  try {
    const base = new Airtable({ apiKey: API_KEY }).base(IMAGES_BASE_ID);
    const table = base(IMAGES_TABLE_ID) as {
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
              cachedImages = {};
              resolve(cachedImages);
              return;
            }
            const result: ImageMap = {};
            for (const r of all) {
              const section = String((r.get("Section") as string) ?? (r.fields["Section"] as string) ?? "").trim();
              const name = String((r.get("Name") as string) ?? (r.fields["Name"] as string) ?? "").trim();
              const picture = (r.fields["Picture"] as Array<{ url?: string }>) ?? (r.get("Picture") as Array<{ url?: string }>);
              const url = (Array.isArray(picture) ? picture[0] : undefined)?.url;
              if (name && url) {
                result[buildKey(section, name)] = url;
              }
            }
            cachedImages = result;
            resolve(result);
          }
        );
    });
  } catch (e) {
    console.error("[airtable-images] error:", e);
    cachedImages = {};
    return cachedImages;
  }
}

/**
 * Returns the Airtable attachment URL for the given section (folder) and name (filename).
 * Lookup is case-insensitive and extension-agnostic. Returns null when not found, except
 * for the logo which falls back to /lta-logo.png. Callers should show initials placeholder when null.
 */
export function getImageUrl(images: ImageMap | null, section: string, name: string): string | null {
  if (!images) {
    if (!section && name === "lta-logo.png") return LOGO_FALLBACK;
    return null;
  }
  const exactKey = buildKey(section, name);
  const exact = images[exactKey];
  if (exact) return exact;
  const byBase = findByBaseName(images, section, name);
  if (byBase) return byBase;
  if (!section && name === "lta-logo.png") return LOGO_FALLBACK;
  return null;
}
