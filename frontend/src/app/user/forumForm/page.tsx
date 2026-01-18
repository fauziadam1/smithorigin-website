"use client";
import Link from "next/link";
import api from "../../../lib/axios";
import React, { useState } from "react";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/ui/authcontext";
import { BsArrowLeft as ArrowIcon } from "react-icons/bs";
import { LuCircleAlert as AlertIcon } from "react-icons/lu";
import { PiPaperPlaneRightFill as PlaneIcon } from "react-icons/pi";

export default function ForumForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Anda harus login terlebih dahulu untuk membuat thread.");
      setTimeout(() => router.push("/auth/login"), 3000);
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Judul dan isi percakapan wajib diisi!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/forums", { title, content });

      setSuccess("Percakapan berhasil dikirim!");
      setTitle("");
      setContent("");
      console.log("Response dari server:", response.data);

      setTimeout(() => {
        router.push("/user/forum");
      }, 1000);
    } catch (err: unknown) {
      console.error("Error saat submit forum:", err);
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response
          ?.data?.message === "string"
      ) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response!
            .data!.message!,
        );
      } else {
        setError("Terjadi kesalahan. Gagal mengirim percakapan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen mt-30 md:mt-40 px-4.5  md:px-10">
      <section className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <SquarePen className="w-6 h-6 md:w-8 md:h-8 text-red-800" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Bagikan Pendapat Anda
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Mulai diskusi baru di komunitas
              </p>
            </div>
          </div>
          <Link href="/user/forum">
            <div className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-800 transition-all duration-200 text-sm md:text-base font-medium">
              <ArrowIcon className="w-4 h-4" />
              Kembali
            </div>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-8">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Detail Percakapan
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mb-6">
            Isi detail berikut untuk memulai diskusi baru
          </p>

          {error && (
            <p className="text-red-500 text-xs md:text-sm mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-xs md:text-sm mb-4">{success}</p>
          )}

          <form
            className="flex flex-col gap-5 md:gap-6 border-b border-gray-200 pb-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-medium">
                Judul Topik
              </label>
              <input
                type="text"
                placeholder="Contoh: Butuh rekomendasi gear buat main game online"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs md:text-sm font-medium">
                Pendapat atau Saran Anda
              </label>
              <textarea
                placeholder="Jelaskan pendapat, saran, atau pertanyaan Anda secara detail"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none h-28 md:h-32"
              />
              <span className="text-[9px] md:text-xs text-gray-400">
                Kritik maupun saran akan sangat membantu website ini untuk lebih
                berkembang dan inovatif.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 cursor-pointer bg-red-800 text-white font-medium py-2.5 px-5 md:px-6 rounded-full hover:bg-red-900 transition disabled:opacity-50 text-sm md:text-base"
              >
                <PlaneIcon className="rotate-180 w-4 h-4" />
                {loading ? "Mengirim..." : "Kirim Percakapan"}
              </button>
            </div>
          </form>

          <div className="mt-5 md:mt-6 flex items-start md:items-center gap-2 text-[11px] md:text-xs text-gray-500">
            <AlertIcon className="text-red-800 w-4 h-4 shrink-0 mt-0.5 md:mt-0" />
            <span>Bijak dalam berkomunikasi dan jaga privasi Anda.</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            💡 Tips untuk diskusi yang baik:
          </h3>
          <ul className="text-xs md:text-sm text-gray-600 space-y-1.5 ml-4">
            <li className="list-disc">
              Gunakan judul yang spesifik dan mudah dipahami
            </li>
            <li className="list-disc">
              Jelaskan masalah atau topik dengan detail yang cukup
            </li>
            <li className="list-disc">
              Hindari konten yang menyinggung atau melanggar privasi
            </li>
            <li className="list-disc">
              Hormati pendapat dan pengalaman pengguna lain
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
