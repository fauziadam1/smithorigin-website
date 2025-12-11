'use client'
import Header from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { usePathname } from "next/navigation";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/user";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`${isHome ? '' : 'pb-20'} flex-1`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
