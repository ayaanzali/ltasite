import { NextResponse } from "next/server";
import { fetchWebsiteImages } from "@/lib/airtable-images";

export async function GET() {
  try {
    const images = await fetchWebsiteImages();
    return NextResponse.json(images, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
