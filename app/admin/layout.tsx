import AdminShell from "@/components/admin/admin-shell"

/**
 * Static export: no server middleware. The shell gates UI; newsletter/feedback reads must be
 * denied in Appwrite for non-admin users (client SDK + permission rules).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
