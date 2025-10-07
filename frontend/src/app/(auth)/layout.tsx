import Header from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";

export default async function SiteLayout({
    children,
}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <main>
                {children}
            </main>
        </>
    );
}
