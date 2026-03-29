import { LiveScoreBoard } from "@/components/live/live-score-board";
import { PageBanner } from "@/components/page-banner";
import { getMatches } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const matches = await getMatches();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Live scores", "Realtime", "Organizer synced"]}
        description="Updated from the live desk across courts, halls, and grounds."
        eyebrow="UDGAM live"
        title="Live Scores"
      />
      <LiveScoreBoard initialMatches={matches} />
    </div>
  );
}
