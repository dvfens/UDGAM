import styles from "@/app/page.module.css";

export function HeroStage() {
  return (
    <div className={styles.stage}>
      <div className={styles.stageBadge}>Hero cut-in zone</div>
      <div className={styles.stageFrame}>
        <div className={styles.stageSilhouette} />
        <div className={styles.stagePulse} />
        <div className={styles.stageOrbitOne} />
        <div className={styles.stageOrbitTwo} />
      </div>
      <div className={styles.stageMeta}>
        <span>3d character slot</span>
        <span>anime lead later</span>
      </div>
    </div>
  );
}
