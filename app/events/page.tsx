import { PageBanner } from "@/components/page-banner";
import { getEvents, getSports } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, sports] = await Promise.all([getEvents(), getSports()]);

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Fixtures", "University teams", "Finals"]}
        description="Every sport, one structured event deck."
        eyebrow="UDGAM events"
        title="Events & Fixtures"
      />

      <div className={styles.gridThree}>
        {events.map((event) => (
          <article className={styles.darkCard} key={event.id}>
            <p className={styles.darkEyebrow}>{event.sport}</p>
            <h2 className={styles.title}>{event.title}</h2>
            <p className={styles.darkText}>{event.summary}</p>
            <div className={styles.metaRow}>
              <span>{event.venue}</span>
              <span>{formatDateTime(event.start)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.gridTwo}>
        {sports.map((sport) => (
          <article className={styles.card} key={sport.id}>
            <p className={styles.eyebrow}>Competition lane</p>
            <h2 className={styles.title}>{sport.name}</h2>
            <p className={styles.text}>{sport.tagline}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
