import type { MatchStatus } from "@/lib/types";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function statusLabel(status: MatchStatus) {
  switch (status) {
    case "LIVE":
      return "Live";
    case "HALFTIME":
      return "Half";
    case "PAUSED":
      return "Paused";
    case "FINAL":
      return "Final";
    default:
      return "Next";
  }
}

export function asDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

