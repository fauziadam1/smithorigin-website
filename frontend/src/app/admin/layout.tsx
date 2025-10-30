import AdminLayout from "../components/sidebar/AdminLayout";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode; }>) {
  return <AdminLayout>{children}</AdminLayout>;
}