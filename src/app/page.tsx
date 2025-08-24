export default function Home() {
  return (
    <div className="w-full">
      <div className="absolute left-0 w-full h-screen bg-cover bg-center bg-hero">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-center h-[80vh] text-white">
            <h2 className="text-5xl font-bold">LEVEL UP</h2>
            <p className="mt-4 max-w-lg">
              Toko penyedia gaming gear nomor 1 di Indonesia. Ikuti terus perkembangan dan produk terbaru dari kami.
            </p>
            <button className="mt-6 px-6 py-3 bg-red-600 rounded-lg font-semibold hover:bg-red-700">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
