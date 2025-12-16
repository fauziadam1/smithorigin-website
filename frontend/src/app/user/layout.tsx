'use client'
import Header from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../components/ui/AuthContext";
import { FavoriteProvider } from "../components/ui/FavoriteContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/user";

  return (
    <FavoriteProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className={`${isHome ? '' : 'pb-20'} flex-1`}>
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </FavoriteProvider>
  );
}
