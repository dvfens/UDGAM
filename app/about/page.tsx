import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Students", "Competition", "Campus culture"]}
        description="UDGAM is the university sports festival for teams, spectators, and live campus energy."
        eyebrow="About UDGAM"
        title="About UDGAM"
      />

      <div className={styles.gridThree}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Students first</p>
          <h2 className={styles.title}>Built for teams and spectators.</h2>
          <p className={styles.text}>
            Fixtures, venues, and match updates stay readable for players, volunteers,
            and the wider campus audience.
          </p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Live operations</p>
          <h2 className={styles.title}>Scores and media move in real time.</h2>
          <p className={styles.text}>
            The public site is connected to an organizer desk for instant score and
            gallery updates during the festival.
          </p>
        </article>
        <article className={styles.darkCard}>
          <p className={styles.darkEyebrow}>Future-ready</p>
          <h2 className={styles.title}>Mascot and 3D scenes can land later.</h2>
          <p className={styles.darkText}>
            The visual system is structured so representative 3D characters can be
            added without redesigning the site again.
          </p>
        </article>
      </div>
    </div>
  );
}
