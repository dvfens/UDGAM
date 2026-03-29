import { LiveGalleryRail } from "@/components/live/live-gallery-rail";
import { PageBanner } from "@/components/page-banner";
import { getGalleryImages } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Campus moments", "Live uploads", "Media wall"]}
        description="Fresh frames from matches, ceremonies, and the crowd."
        eyebrow="UDGAM gallery"
        title="Campus Gallery"
      />
      <LiveGalleryRail initialImages={images} />
    </div>
  );
}
