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