"use client";
import { useState } from "react";
import Image from "next/image";

type MoodboardItem = {
  id: string;
  imagem_url: string;
  legenda: string | null;
  ordem: number;
};

export default function MoodboardGrid({
  itens,
  editavel,
  onRemove,
}: {
  itens: MoodboardItem[];
  editavel?: boolean;
  onRemove?: (id: string) => void;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const sorted = [...itens].sort((a, b) => a.ordem - b.ordem);

  return (
    <>
      <div className="moodboard-grid">
        {sorted.map((item) => (
          <div key={item.id} className="moodboard-item" onClick={() => setLightbox(item.imagem_url)}>
            <Image src={item.imagem_url} alt={item.legenda || "Imagem do moodboard"} fill className="object-cover" />
            {editavel && onRemove && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                className="absolute top-1.5 right-1.5 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
                aria-label="Remover imagem"
              >
                ×
              </button>
            )}
            {item.legenda && (
              <div
                className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs"
                style={{ background: "rgba(42,31,20,0.6)", color: "#fff" }}
              >
                {item.legenda}
              </div>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="empty-state col-span-full">
            <div className="empty-state-icon">🖼️</div>
            <p className="empty-state-title">Moodboard vazio</p>
            <p className="empty-state-desc">Adicione imagens para começar o moodboard.</p>
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <Image src={lightbox} alt="Imagem ampliada" width={900} height={700} className="object-contain rounded-xl" style={{ maxHeight: "85vh", width: "auto" }} />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setLightbox(null)}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
