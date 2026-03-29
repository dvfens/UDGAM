import { ParallaxScene } from "@/components/public/parallax-scene";
import {
  PatternedPanel,
  type PanelPattern,
  type PanelTone,
} from "@/components/public/patterned-panel";
import panelStyles from "@/components/public/public-ui.module.css";
import styles from "@/components/site.module.css";

interface PageBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  tone?: PanelTone;
  pattern?: PanelPattern;
}

export function PageBanner({
  eyebrow,
  title,
  description,
  chips,
  tone = "dark",
  pattern = "court",
}: PageBannerProps) {
  return (
    <ParallaxScene className={panelStyles.bannerWrap} strength={12}>
      <PatternedPanel
        as="section"
        className={panelStyles.bannerPanel}
        pattern={pattern}
        tone={tone}
      >
        <p className={panelStyles.bannerEyebrow}>{eyebrow}</p>
        <h1 className={styles.bannerTitle}>{title}</h1>
        <p className={styles.bannerText}>{description}</p>
        <div className={styles.chips}>
          {chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      </PatternedPanel>
    </ParallaxScene>
  );
}
