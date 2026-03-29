import { Buffer } from "node:buffer";

import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth";
import { createGalleryImage, getGalleryImages } from "@/lib/data";
import { env } from "@/lib/env";
import { uploadImageToR2 } from "@/lib/r2";
import { emitGalleryUpdate } from "@/lib/socket-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fileToDataUrl(file: File, bytes: ArrayBuffer) {
  const mimeType = file.type || "image/png";
  const base64 = Buffer.from(bytes).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const featured = formData.get("featured") === "on";
  const file = formData.get("file");

  if (!(file instanceof File) || !title.trim()) {
    return NextResponse.json({ error: "Image title and file are required." }, { status: 400 });
  }

  let uploadResult: { key?: string; url: string };

  if (env.r2.configured) {
    uploadResult = await uploadImageToR2(file);
  } else if (env.demoMode) {
    const bytes = await file.arrayBuffer();
    uploadResult = {
      url: fileToDataUrl(file, bytes),
    };
  } else {
    return NextResponse.json(
      { error: "Cloudflare R2 is not configured for production uploads." },
      { status: 503 },
    );
  }

  const image = await createGalleryImage({
    title,
    caption,
    featured,
    url: uploadResult.url,
    uploadedById: session.user.id,
    r2Key: uploadResult.key,
  });

  emitGalleryUpdate(await getGalleryImages());

  return NextResponse.json({ image }, { status: 201 });
}
