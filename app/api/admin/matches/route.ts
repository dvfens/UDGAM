import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { createMatch, getMatches } from "@/lib/data";
import { emitScoreUpdate } from "@/lib/socket-server";

const createMatchSchema = z.object({
  sport: z.string().min(2),
  eventTitle: z.string().min(2),
  homeTeam: z.string().min(2),
  awayTeam: z.string().min(2),
  venue: z.string().min(2),
  startsAt: z.string().datetime(),
  status: z.enum(["SCHEDULED", "LIVE", "PAUSED", "HALFTIME", "FINAL"]),
  featured: z.boolean().optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createMatchSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid match payload." }, { status: 400 });
  }

  const match = await createMatch(parsed.data);
  emitScoreUpdate(await getMatches());

  return NextResponse.json({ match }, { status: 201 });
}

