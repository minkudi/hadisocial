import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage({ params }) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;

  if (!userId || isAdmin !== "1") {
    redirect(`/${locale}/login`);
  }

  const isSuperAdmin = cookieStore.get("is_super_admin")?.value === "1";

  return <SettingsClient isSuperAdmin={isSuperAdmin} locale={locale} />;
}
