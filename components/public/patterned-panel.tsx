import type { ElementType, ReactNode } from "react";

import styles from "@/components/public/public-ui.module.css";

export type PanelTone = "dark" | "accent" | "lime" | "blush" | "neutral";
export type PanelPattern = "grid" | "court" | "diagonal" | "rings" | "ticks";

const toneClassNames: Record<PanelTone, string> = {
  dark: styles.toneDark,
  accent: styles.toneAccent,
  lime: styles.toneLime,
  blush: styles.toneBlush,
  neutral: styles.toneNeutral,
};

const patternClassNames: Record<PanelPattern, string> = {
  grid: styles.patternGrid,
  court: styles.patternCourt,
  diagonal: styles.patternDiagonal,
  rings: styles.patternRings,
  ticks: styles.patternTicks,
};

interface PatternedPanelProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: PanelTone;
  pattern?: PanelPattern;
}

export function PatternedPanel({
  as: Component = "div",
  children,
  className,
  tone = "neutral",
  pattern = "grid",
}: PatternedPanelProps) {
  return (
    <Component
      className={[
        styles.panel,
        toneClassNames[tone],
        patternClassNames[pattern],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}

