'use client'
import Header from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../components/ui/authcontext";
import { FavoriteProvider } from "../components/ui/favoritecontext";

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
