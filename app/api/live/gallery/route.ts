import { NextResponse } from "next/server";

import { getGalleryImages } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json({ images });
}

