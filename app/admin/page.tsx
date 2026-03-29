import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminPanel } from "@/components/admin/admin-panel";
import { PageBanner } from "@/components/page-banner";
import { getAuthSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAuthSession();
  const snapshot = await getDashboardSnapshot();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Credentials auth", "Realtime push desk", "R2 upload flow"]}
        description="Organizer controls for live scores and live image drops. Public pages update the moment a change is published here."
        eyebrow="Admin"
        title="Control the live desk."
      />

      {session?.user ? (
        <AdminPanel snapshot={snapshot} userName={session.user.name ?? "Organizer"} />
      ) : (
        <AdminLoginForm demoHint={snapshot.adminHint} />
      )}
    </div>
  );
}
