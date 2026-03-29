import { randomUUID } from "node:crypto";

import { MatchStatus } from "@prisma/client";

import { getAdminHint } from "@/lib/auth";
import { getDemoStore } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type {
  CreateGalleryImageInput,
  CreateMatchInput,
  DashboardSnapshot,
  EventSummary,
  GalleryItem,
  LiveMatch,
  ScheduleEntry,
  SportSummary,
  UpdateMatchInput,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

async function withFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T | Promise<T>,
) {
  try {
    return await operation();
  } catch {
    return fallback();
  }
}

function shouldUseDemoData() {
  return env.demoMode || !prisma;
}

function mapMatch(match: {
  id: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startsAt: Date;
  venue: string | null;
  featured: boolean;
  updatedAt: Date;
  sport: { name: string } | null;
  event: { title: string } | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
}): LiveMatch {
  return {
    id: match.id,
    sport: match.sport?.name ?? "Sport",
    eventTitle: match.event?.title ?? "UDGAM Match",
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    startsAt: match.startsAt.toISOString(),
    venue: match.venue ?? "Main Arena",
    featured: match.featured,
    updatedAt: match.updatedAt.toISOString(),
  };
}

function mapGallery(item: {
  id: string;
  title: string;
  caption: string | null;
  url: string;
  featured: boolean;
  createdAt: Date;
}): GalleryItem {
  return {
    id: item.id,
    title: item.title,
    caption: item.caption ?? "",
    url: item.url,
    featured: item.featured,
    createdAt: item.createdAt.toISOString(),
  };
}

function sortMatches(matches: LiveMatch[]) {
  return [...matches].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function getDemoMatches(featuredOnly = false) {
  const matches = sortMatches(getDemoStore().matches);
  return featuredOnly ? matches.filter((match) => match.featured) : matches;
}

function getDemoImages(featuredOnly = false) {
  const images = [...getDemoStore().gallery].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return featuredOnly ? images.filter((image) => image.featured) : images;
}

function createDemoMatch(input: CreateMatchInput) {
  const store = getDemoStore();
  const match: LiveMatch = {
    id: `match-${randomUUID()}`,
    sport: input.sport,
    eventTitle: input.eventTitle,
    homeTeam: input.homeTeam,
    awayTeam: input.awayTeam,
    homeScore: 0,
    awayScore: 0,
    status: input.status,
    startsAt: input.startsAt,
    venue: input.venue,
    featured: input.featured ?? false,
    updatedAt: new Date().toISOString(),
  };

  store.matches.unshift(match);
  return match;
}

function updateDemoMatch(matchId: string, input: UpdateMatchInput) {
  const store = getDemoStore();
  const target = store.matches.find((match) => match.id === matchId);

  if (!target) {
    throw new Error("Match not found.");
  }

  target.homeScore = input.homeScore;
  target.awayScore = input.awayScore;
  target.status = input.status;
  target.featured = input.featured;
  target.updatedAt = new Date().toISOString();
  return target;
}

function createDemoGalleryImage(input: CreateGalleryImageInput) {
  const image: GalleryItem = {
    id: `gallery-${randomUUID()}`,
    title: input.title,
    caption: input.caption ?? "",
    url: input.url,
    featured: input.featured ?? false,
    createdAt: new Date().toISOString(),
  };

  getDemoStore().gallery.unshift(image);
  return image;
}

export async function getSports(): Promise<SportSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoStore().sports;
  }

  return withFallback(
    async () => {
      const sports = await prisma!.sport.findMany({
        orderBy: { name: "asc" },
      });

      return sports.map((sport) => ({
        id: sport.id,
        name: sport.name,
        slug: sport.slug,
        accent: sport.accentColor ?? "#f35c38",
        tagline: sport.tagline ?? "Built for UDGAM pace.",
      }));
    },
    () => getDemoStore().sports,
  );
}

export async function getEvents(): Promise<EventSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoStore().events;
  }

  return withFallback(
    async () => {
      const events = await prisma!.event.findMany({
        include: { sport: true },
        orderBy: { startsAt: "asc" },
      });

      return events.map((event) => ({
        id: event.id,
        title: event.title,
        sport: event.sport?.name ?? "Campus Event",
        start: event.startsAt.toISOString(),
        venue: event.location ?? "UDGAM Arena",
        summary: event.summary,
      }));
    },
    () => getDemoStore().events,
  );
}

export async function getMatches(options?: { featuredOnly?: boolean }) {
  const featuredOnly = options?.featuredOnly ?? false;

  if (shouldUseDemoData()) {
    return getDemoMatches(featuredOnly);
  }

  return withFallback(
    async () => {
      const matches = await prisma!.match.findMany({
        where: featuredOnly ? { featured: true } : undefined,
        include: {
          sport: true,
          event: true,
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      return matches.map(mapMatch);
    },
    () => getDemoMatches(featuredOnly),
  );
}

export async function getGalleryImages(options?: { featuredOnly?: boolean }) {
  const featuredOnly = options?.featuredOnly ?? false;

  if (shouldUseDemoData()) {
    return getDemoImages(featuredOnly);
  }

  return withFallback(
    async () => {
      const images = await prisma!.galleryImage.findMany({
        where: featuredOnly ? { featured: true } : undefined,
        orderBy: { createdAt: "desc" },
      });

      return images.map(mapGallery);
    },
    () => getDemoImages(featuredOnly),
  );
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  const [events, matches] = await Promise.all([getEvents(), getMatches()]);

  return [
    ...events.map((event) => ({
      id: event.id,
      title: event.title,
      detail: `${event.sport} - ${event.venue}`,
      time: event.start,
      type: "EVENT" as const,
    })),
    ...matches.map((match) => ({
      id: match.id,
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      detail: `${match.sport} - ${match.venue}`,
      time: match.startsAt,
      type: "MATCH" as const,
    })),
  ].sort(
    (left, right) =>
      new Date(left.time).getTime() - new Date(right.time).getTime(),
  );
}

async function ensureSport(name: string) {
  const slug = slugify(name);
  const existing = await prisma!.sport.findUnique({ where: { slug } });
  if (existing) {
    return existing;
  }

  return prisma!.sport.create({
    data: {
      name,
      slug,
      accentColor: "#f35c38",
      tagline: "Freshly created from the UDGAM control desk.",
    },
  });
}

async function ensureEvent(title: string, sportId?: string) {
  const slug = slugify(title);
  const existing = await prisma!.event.findUnique({ where: { slug } });
  if (existing) {
    return existing;
  }

  return prisma!.event.create({
    data: {
      title,
      slug,
      summary: "Live event entry created during UDGAM operations.",
      location: "UDGAM Arena",
      startsAt: new Date(),
      sportId,
    },
  });
}

async function ensureTeam(name: string, sportId?: string) {
  const slug = slugify(name);
  const existing = await prisma!.team.findUnique({
    where: { slug },
  });
  if (existing) {
    return existing;
  }

  return prisma!.team.create({
    data: {
      name,
      slug,
      shortName: name.slice(0, 3).toUpperCase(),
      institution: "UDGAM",
      sportId,
    },
  });
}

export async function createMatch(input: CreateMatchInput) {
  if (shouldUseDemoData()) {
    return createDemoMatch(input);
  }

  return withFallback(
    async () => {
      const sport = await ensureSport(input.sport);
      const event = await ensureEvent(input.eventTitle, sport.id);
      const homeTeam = await ensureTeam(input.homeTeam, sport.id);
      const awayTeam = await ensureTeam(input.awayTeam, sport.id);

      const match = await prisma!.match.create({
        data: {
          sportId: sport.id,
          eventId: event.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          venue: input.venue,
          startsAt: new Date(input.startsAt),
          status: input.status,
          featured: input.featured ?? false,
          scoreSnapshots: {
            create: {
              homeScore: 0,
              awayScore: 0,
              status: input.status,
              note: "Match created from admin desk.",
            },
          },
        },
        include: {
          sport: true,
          event: true,
          homeTeam: true,
          awayTeam: true,
        },
      });

      return mapMatch(match);
    },
    () => createDemoMatch(input),
  );
}

export async function updateMatch(matchId: string, input: UpdateMatchInput) {
  if (shouldUseDemoData()) {
    return updateDemoMatch(matchId, input);
  }

  return withFallback(
    async () => {
      const updated = await prisma!.match.update({
        where: { id: matchId },
        data: {
          homeScore: input.homeScore,
          awayScore: input.awayScore,
          status: input.status,
          featured: input.featured,
          scoreSnapshots: {
            create: {
              homeScore: input.homeScore,
              awayScore: input.awayScore,
              status: input.status,
            },
          },
        },
        include: {
          sport: true,
          event: true,
          homeTeam: true,
          awayTeam: true,
        },
      });

      return mapMatch(updated);
    },
    () => updateDemoMatch(matchId, input),
  );
}

export async function createGalleryImage(input: CreateGalleryImageInput) {
  if (shouldUseDemoData()) {
    return createDemoGalleryImage(input);
  }

  return withFallback(
    async () => {
      const image = await prisma!.galleryImage.create({
        data: {
          title: input.title,
          caption: input.caption,
          url: input.url,
          featured: input.featured ?? false,
          uploadedById: input.uploadedById,
          r2Key: input.r2Key,
        },
      });

      return mapGallery(image);
    },
    () => createDemoGalleryImage(input),
  );
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [matches, gallery] = await Promise.all([getMatches(), getGalleryImages()]);

  return {
    matches,
    gallery,
    r2Configured: env.r2.configured,
    demoMode: env.demoMode,
    adminHint: getAdminHint(),
  };
}
