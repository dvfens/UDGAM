import type { ReactNode } from "react";

import styles from "@/components/site.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  text?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
}: SectionHeadingProps) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <p className={styles.sectionEyebrow}>{eyebrow}</p>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {text ? <p className={styles.sectionText}>{text}</p> : null}
      </div>
      {action}
    </div>
  );
}

