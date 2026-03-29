const r2Keys = [
  "R2_ACCOUNT_ID",
  "R2_BUCKET",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_PUBLIC_URL",
] as const;

const hasAllR2Keys = r2Keys.every((key) => Boolean(process.env[key]));

export const env = {
  baseUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me",
  hasDatabase: Boolean(process.env.DATABASE_URL),
  demoMode: process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL,
  r2: {
    configured: hasAllR2Keys,
    accountId: process.env.R2_ACCOUNT_ID ?? "",
    bucket: process.env.R2_BUCKET ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    publicUrl: process.env.R2_PUBLIC_URL ?? "",
  },
} as const;

