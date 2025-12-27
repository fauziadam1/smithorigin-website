import AdminLayout from "../components/sidebar/sidebar";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode; }>) {
  return <AdminLayout>{children}</AdminLayout>;
}