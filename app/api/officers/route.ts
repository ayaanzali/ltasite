import { NextResponse } from "next/server";
import { fetchOfficersFromBase } from "@/lib/airtable";

export async function GET() {
  try {
    const officers = await fetchOfficersFromBase();
    return NextResponse.json(officers);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
