import { PageBanner } from "@/components/page-banner";
import { getScheduleEntries } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const schedule = await getScheduleEntries();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Ceremonies", "Fixtures", "Venues"]}
        description="Opening parade, league stages, and finals in one clear timeline."
        eyebrow="UDGAM schedule"
        title="Festival Schedule"
      />

      <section className={styles.timeline}>
        {schedule.map((entry) => (
          <article className={styles.timelineItem} key={entry.id}>
            <p className={styles.eyebrow}>{entry.type}</p>
            <h2 className={styles.title}>{entry.title}</h2>
            <p className={styles.text}>{entry.detail}</p>
            <p className={styles.text}>{formatDateTime(entry.time)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
