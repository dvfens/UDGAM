import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/lib/env";

let client: S3Client | null = null;

function getR2Client() {
  if (!env.r2.configured) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }

  return client;
}

export async function uploadImageToR2(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : "jpg";
  const key = `gallery/${new Date().getFullYear()}/${randomUUID()}.${extension}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return {
    key,
    url: `${env.r2.publicUrl.replace(/\/$/, "")}/${key}`,
  };
}

