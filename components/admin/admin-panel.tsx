"use client";

import { startTransition, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { DashboardSnapshot, LiveMatch } from "@/lib/types";

import styles from "@/components/admin/admin.module.css";

interface AdminPanelProps {
  snapshot: DashboardSnapshot;
  userName: string;
}

export function AdminPanel({ snapshot, userName }: AdminPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreateMatch(formData: FormData) {
    setBusy(true);
    setMessage("");

    const rawStartsAt = String(formData.get("startsAt") ?? "");
    const payload = {
      sport: String(formData.get("sport") ?? ""),
      eventTitle: String(formData.get("eventTitle") ?? ""),
      homeTeam: String(formData.get("homeTeam") ?? ""),
      awayTeam: String(formData.get("awayTeam") ?? ""),
      venue: String(formData.get("venue") ?? ""),
      startsAt: rawStartsAt ? new Date(rawStartsAt).toISOString() : "",
      status: String(formData.get("status") ?? "SCHEDULED"),
      featured: formData.get("featured") === "on",
    };

    const response = await fetch("/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);

    if (!response.ok) {
      setMessage("Could not create the match card.");
      return;
    }

    setMessage("Match published to the live board.");
    startTransition(() => router.refresh());
  }

  async function handleUpdateMatch(match: LiveMatch, formData: FormData) {
    setBusy(true);
    setMessage("");

    const payload = {
      homeScore: Number(formData.get("homeScore") ?? 0),
      awayScore: Number(formData.get("awayScore") ?? 0),
      status: String(formData.get("status") ?? match.status),
      featured: formData.get("featured") === "on",
    };

    const response = await fetch(`/api/admin/matches/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);

    if (!response.ok) {
      setMessage(`Could not update ${match.homeTeam} vs ${match.awayTeam}.`);
      return;
    }

    setMessage(`Updated ${match.homeTeam} vs ${match.awayTeam}.`);
    startTransition(() => router.refresh());
  }

  async function handleUpload(formData: FormData) {
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(payload?.error ?? "Upload failed.");
      return;
    }

    setMessage("Frame pushed to the live gallery.");
    startTransition(() => router.refresh());
  }

  return (
    <div className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.text}>Organizer desk</p>
        <h2 className={styles.title}>Welcome back, {userName}</h2>
        <p className={styles.text}>
          Publish score swings and photo drops in real time.
        </p>

        <div className={styles.buttonRow}>
          <button className={styles.logoutButton} onClick={() => void signOut({ callbackUrl: "/admin" })} type="button">
            Log out
          </button>
        </div>

        {snapshot.demoMode ? (
          <div className={styles.hintBox}>
            Demo mode is on. Scores and gallery uploads stay in memory until the server restarts.
          </div>
        ) : null}

        {!snapshot.r2Configured ? (
          <div className={styles.warningBox}>
            Cloudflare R2 is not configured yet. Image uploads will still work in demo mode, but production needs the R2 keys from <code>.env</code>.
          </div>
        ) : null}

        <p className={styles.message}>{message}</p>
      </section>

      <div className={styles.grid}>
        <div className={styles.stack}>
          <section className={styles.card}>
            <h3 className={styles.title}>Create match</h3>
            <form
              action={(formData) => {
                void handleCreateMatch(formData);
              }}
              className={styles.form}
            >
              <div className={styles.fieldGrid}>
                <label className={styles.label}>
                  Sport
                  <input className={styles.input} name="sport" placeholder="Basketball" required />
                </label>
                <label className={styles.label}>
                  Event
                  <input className={styles.input} name="eventTitle" placeholder="Night Finals" required />
                </label>
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.label}>
                  Home team
                  <input className={styles.input} name="homeTeam" placeholder="Falcon House" required />
                </label>
                <label className={styles.label}>
                  Away team
                  <input className={styles.input} name="awayTeam" placeholder="Blaze Unit" required />
                </label>
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.label}>
                  Venue
                  <input className={styles.input} name="venue" placeholder="Arena A" required />
                </label>
                <label className={styles.label}>
                  Starts at
                  <input className={styles.input} name="startsAt" required type="datetime-local" />
                </label>
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.label}>
                  Status
                  <select className={styles.select} defaultValue="SCHEDULED" name="status">
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="LIVE">Live</option>
                    <option value="HALFTIME">Halftime</option>
                    <option value="PAUSED">Paused</option>
                    <option value="FINAL">Final</option>
                  </select>
                </label>
                <label className={styles.checkboxRow}>
                  <input name="featured" type="checkbox" />
                  Feature on live board
                </label>
              </div>

              <div className={styles.buttonRow}>
                <button className={styles.primaryButton} disabled={busy} type="submit">
                  {busy ? "Publishing..." : "Publish match"}
                </button>
              </div>
            </form>
          </section>

          <section className={styles.card}>
            <h3 className={styles.title}>Upload frame</h3>
            <form
              action={(formData) => {
                void handleUpload(formData);
              }}
              className={styles.form}
            >
              <label className={styles.label}>
                Title
                <input className={styles.input} name="title" placeholder="Arena Warmup" required />
              </label>
              <label className={styles.label}>
                Caption
                <textarea
                  className={styles.textarea}
                  name="caption"
                  placeholder="Sharp frame. Quick energy. Minimal words."
                />
              </label>
              <div className={styles.fieldGrid}>
                <label className={styles.label}>
                  Image file
                  <input className={styles.input} accept="image/*" name="file" required type="file" />
                </label>
                <label className={styles.checkboxRow}>
                  <input defaultChecked name="featured" type="checkbox" />
                  Feature on homepage
                </label>
              </div>

              <div className={styles.buttonRow}>
                <button className={styles.primaryButton} disabled={busy} type="submit">
                  {busy ? "Uploading..." : "Push to gallery"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className={styles.stack}>
          <section className={styles.card}>
            <h3 className={styles.title}>Active matches</h3>
            <div className={styles.matchList}>
              {snapshot.matches.map((match) => (
                <form
                  key={match.id}
                  action={(formData) => {
                    void handleUpdateMatch(match, formData);
                  }}
                  className={styles.matchCard}
                >
                  <div className={styles.matchHeader}>
                    <div>
                      <p className={styles.matchTitle}>
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className={styles.muted}>
                        {match.sport} · {match.venue}
                      </p>
                    </div>
                    <span className={styles.muted}>{match.status}</span>
                  </div>

                  <div className={styles.inlineGrid}>
                    <label className={styles.label}>
                      Home
                      <input className={styles.input} defaultValue={match.homeScore} min="0" name="homeScore" type="number" />
                    </label>
                    <label className={styles.label}>
                      Away
                      <input className={styles.input} defaultValue={match.awayScore} min="0" name="awayScore" type="number" />
                    </label>
                    <label className={styles.label}>
                      Status
                      <select className={styles.select} defaultValue={match.status} name="status">
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE">Live</option>
                        <option value="HALFTIME">Halftime</option>
                        <option value="PAUSED">Paused</option>
                        <option value="FINAL">Final</option>
                      </select>
                    </label>
                  </div>

                  <label className={styles.checkboxRow}>
                    <input defaultChecked={match.featured} name="featured" type="checkbox" />
                    Featured match
                  </label>

                  <div className={styles.buttonRow}>
                    <button className={styles.secondaryButton} disabled={busy} type="submit">
                      Save update
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.title}>Recent frames</h3>
            <div className={styles.galleryList}>
              {snapshot.gallery.slice(0, 4).map((image) => (
                <article className={styles.galleryCard} key={image.id}>
                  <img alt={image.title} className={styles.thumb} src={image.url} />
                  <div>
                    <p className={styles.galleryTitle}>{image.title}</p>
                    <p className={styles.muted}>{image.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
