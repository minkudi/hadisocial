import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminsClient from "./AdminsClient";

export default async function AdminAdminsPage({ params }) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  const isSuperAdmin = cookieStore.get("is_super_admin")?.value === "1";

  if (!userId || isAdmin !== "1") {
    redirect(`/${locale}/login`);
  }
  if (!isSuperAdmin) {
    redirect(`/${locale}/admin`);
  }

  return <AdminsClient selfId={Number(userId)} />;
}
