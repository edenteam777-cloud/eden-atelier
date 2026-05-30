"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MoodboardUploader({
  moodboardId,
  onUploaded,
}: {
  moodboardId: string;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError("");
    const supabase = createClient();
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) { setError("Arquivo muito grande. Máximo 5MB."); continue; }
      const ext = file.name.split(".").pop();
      const path = `moodboard/${moodboardId}/${Date.now()}.${ext}`;
      const { data, error: upErr } = await supabase.storage.from("arquivos").upload(path, file, { upsert: true });
      if (upErr) { setError("Erro ao fazer upload."); continue; }
      const { data: urlData } = supabase.storage.from("arquivos").getPublicUrl(data.path);
      await supabase.from("moodboard_itens").insert({
        moodboard_id: moodboardId,
        imagem_url: urlData.publicUrl,
        ordem: Date.now(),
      });
    }
    setUploading(false);
    onUploaded();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="btn btn-secondary"
        disabled={uploading}
      >
        {uploading ? "Enviando..." : "Adicionar imagens"}
      </button>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
