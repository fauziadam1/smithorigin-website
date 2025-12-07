import Header from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  );
}
