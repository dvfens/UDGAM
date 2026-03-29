import type { CSSProperties } from "react";

import {
  PatternedPanel,
  type PanelPattern,
} from "@/components/public/patterned-panel";
import styles from "@/components/public/public-ui.module.css";

interface SportHighlightTileProps {
  title: string;
  text: string;
  label: string;
  accent: string;
  pattern?: PanelPattern;
  className?: string;
}

export function SportHighlightTile({
  title,
  text,
  label,
  accent,
  pattern = "grid",
  className,
}: SportHighlightTileProps) {
  return (
    <PatternedPanel
      as="article"
      className={`${styles.tile} ${className ?? ""}`.trim()}
      pattern={pattern}
      tone="neutral"
    >
      <span className={styles.tileLabel}>{label}</span>
      <div
        className={styles.tileAccent}
        style={{ "--tile-accent": accent } as CSSProperties}
      />
      <h3 className={styles.tileTitle}>{title}</h3>
      <p className={styles.tileText}>{text}</p>
    </PatternedPanel>
  );
}

