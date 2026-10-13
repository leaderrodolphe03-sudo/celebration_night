"use client";

import { Download } from "lucide-react";
import Button from "@/components/ui/Button";

interface MediaDownloadButtonProps {
  title: string;
}

export default function MediaDownloadButton({ title }: MediaDownloadButtonProps) {
  return (
    <Button
      type="button"
      onClick={() => alert(`Téléchargement de « ${title} » en cours...`)}
      variant="secondary"
      size="sm"
      icon={<Download size={14} />}
    >
      Télécharger
    </Button>
  );
}
