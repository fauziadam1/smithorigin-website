import { Button } from "@heroui/button";

export default function Home() {
  return (
    <div className="w-full absolute left-0">
      <section className="w-full h-screen bg-cover bg-center bg-hero pt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-center h-[80vh] text-white gap-5">
            <h1 className="text-button text-7xl font-bold leading-15">
              LEVEL UP <br />
              <span className="text-background text-5xl font-bold">YOUR GAMING GEAR</span>
            </h1>
            <p className="max-w-lg">
              Toko penyedia gaming gear nomor 1 di Indonesia. Ikuti terus perkembangan dan produk terbaru dari kami.
            </p>
            <Button className="bg-button text-white font-[500] py-6 px-7" radius="full">
              Start Shopping
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-background w-full h-screen">

      </section>
    </div>
  );
}
