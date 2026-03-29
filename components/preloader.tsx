"use client";

import { useEffect, useState } from "react";

import styles from "@/components/preloader.module.css";

const CRACK_PATH =
  "M52 0 L44 8 L57 16 L41 26 L59 37 L39 49 L56 60 L43 71 L58 83 L47 91 L52 100";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 1850);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={`${styles.panel} ${styles.leftPanel}`}>
        <div className={styles.panelSurface} />
      </div>

      <div className={`${styles.panel} ${styles.rightPanel}`}>
        <div className={styles.panelSurface} />
      </div>

      <div className={styles.crackTrace}>
        <svg preserveAspectRatio="none" viewBox="0 0 100 100">
          <path className={styles.crackAura} d={CRACK_PATH} />
          <path className={styles.crackCore} d={CRACK_PATH} />
        </svg>
      </div>

      <div className={styles.wordmark}>
        <span>UDGAM</span>
        <small>Festival Arc</small>
      </div>
    </div>
  );
}
