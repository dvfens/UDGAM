"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { io } from "socket.io-client";

import type { LiveMatch } from "@/lib/types";
import { formatDateTime, statusLabel } from "@/lib/utils";

import styles from "@/components/live/live.module.css";

interface LiveScoreBoardProps {
  initialMatches: LiveMatch[];
  compact?: boolean;
}

export function LiveScoreBoard({
  initialMatches,
  compact = false,
}: LiveScoreBoardProps) {
  const [matches, setMatches] = useState(initialMatches);
  const [connected, setConnected] = useState(false);
  const deferredMatches = useDeferredValue(matches);

  useEffect(() => {
    const socket = io({
      path: "/api/socket/io",
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("scores:update", (payload: LiveMatch[]) => setMatches(payload));

    return () => {
      socket.disconnect();
    };
  }, []);

  const visibleMatches = compact ? deferredMatches.slice(0, 2) : deferredMatches;
  const title = compact ? "Scores" : "Live Scores";
  const hint = compact
    ? "Desk synced."
    : "Instant scoreboard sync from the organizer desk.";

  return (
    <section
      className={`${styles.card} ${styles.scoreCardRoot} ${compact ? styles.compactCard : ""}`.trim()}
    >
      {compact ? (
        <div className={styles.slimHeader}>
          <div>
            <span className={styles.slimLabel}>Scores</span>
            <p className={styles.slimHint}>Desk synced.</p>
          </div>
          <span className={connected ? styles.livePill : styles.statusPill}>
            {connected ? "Realtime on" : "Waiting"}
          </span>
        </div>
      ) : (
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.hint}>{hint}</p>
          </div>
          <span className={connected ? styles.livePill : styles.statusPill}>
            {connected ? "Realtime on" : "Waiting"}
          </span>
        </div>
      )}

      <div className={styles.board}>
        {visibleMatches.length ? (
          visibleMatches.map((match) => (
            <article className={styles.matchCard} key={match.id}>
              <div className={styles.matchTop}>
                <div>
                  <div className={styles.sport}>{match.sport}</div>
                  <p className={styles.event}>{match.eventTitle}</p>
                </div>
                <span className={match.status === "LIVE" ? styles.livePill : styles.statusPill}>
                  {statusLabel(match.status)}
                </span>
              </div>

              <div className={styles.scoreLine}>
                <div className={styles.scoreRow}>
                  <span className={styles.team}>{match.homeTeam}</span>
                  <span className={styles.score}>{match.homeScore}</span>
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.team}>{match.awayTeam}</span>
                  <span className={styles.score}>{match.awayScore}</span>
                </div>
              </div>

              <div className={styles.meta}>
                <span>{match.venue}</span>
                <span>{formatDateTime(match.startsAt)}</span>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.empty}>Matches appear here once the desk publishes updates.</div>
        )}
      </div>
    </section>
  );
}
