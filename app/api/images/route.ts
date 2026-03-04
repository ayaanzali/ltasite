import { NextResponse } from "next/server";
import { fetchWebsiteImages } from "@/lib/airtable-images";

export async function GET() {
  try {
    console.log("[api/images] Env check - AIRTABLE_API_KEY:", process.env.AIRTABLE_API_KEY ? `set (len=${process.env.AIRTABLE_API_KEY.length})` : "empty");
    const images = await fetchWebsiteImages();
    return NextResponse.json(images, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
