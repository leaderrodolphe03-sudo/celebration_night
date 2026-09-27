"use client";

import { Download } from "lucide-react";

interface MediaDownloadButtonProps {
  title: string;
}

export default function MediaDownloadButton({ title }: MediaDownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={() => alert(`Téléchargement de « ${title} » en cours...`)}
      className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F5B900] hover:text-[#111111] hover:border-[#F5B900] transition-colors"
    >
      <Download size={14} />
      <span>Télécharger</span>
    </button>
  );
}
