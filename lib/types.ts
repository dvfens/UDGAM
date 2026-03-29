export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "PAUSED"
  | "HALFTIME"
  | "FINAL";

export interface SportSummary {
  id: string;
  name: string;
  slug: string;
  accent: string;
  tagline: string;
}

export interface EventSummary {
  id: string;
  title: string;
  sport: string;
  start: string;
  venue: string;
  summary: string;
}

export interface LiveMatch {
  id: string;
  sport: string;
  eventTitle: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startsAt: string;
  venue: string;
  featured: boolean;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  url: string;
  featured: boolean;
  createdAt: string;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: "EVENT" | "MATCH";
}

export interface DashboardSnapshot {
  matches: LiveMatch[];
  gallery: GalleryItem[];
  r2Configured: boolean;
  demoMode: boolean;
  adminHint: {
    email: string;
    password: string;
  } | null;
}

export interface CreateMatchInput {
  sport: string;
  eventTitle: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  startsAt: string;
  status: MatchStatus;
  featured?: boolean;
}

export interface UpdateMatchInput {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  featured: boolean;
}

export interface CreateGalleryImageInput {
  title: string;
  caption?: string;
  url: string;
  featured?: boolean;
  uploadedById?: string;
  r2Key?: string;
}

