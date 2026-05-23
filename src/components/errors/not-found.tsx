"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen mx-auto bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ornamen Latar Belakang Subtle (Aksen Premium) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md text-center z-10 space-y-6">
        {/* Indikator Visual Minimalis */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary dark:text-primary-foreground shadow-dashboard mb-2 border border-border/40">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        {/* Kode Error & Pesan */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            Pastikan kembali URL yang Anda tuju sudah benar.
          </p>
        </div>

        {/* Garis Pembatas Halus */}
        <div className="h-px w-full bg-border/60" />

        {/* Tombol Aksi (Call to Action) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <Link
            href="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Link>
        </div>
      </div>

      {/* Footer Hak Cipta / Branding Kecil */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/60 select-none">
        &copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.
      </div>
    </div>
  );
}
