"use client";
import { useState } from "react";

type Arquivo = {
  id: string;
  nome: string;
  tipo: string;
  url: string;
  thumbnail_url: string | null;
  tamanho_kb: number | null;
  descricao: string | null;
  visivel_cliente: boolean;
};

const TIPOS = ["moodboard", "planta", "render", "foto_cliente", "entregavel", "referencia", "outro"];

export default function ArquivosGaleria({ arquivos }: { arquivos: Arquivo[] }) {
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  const porTipo = TIPOS.reduce<Record<string, Arquivo[]>>((acc, tipo) => {
    acc[tipo] = arquivos.filter((a) => a.tipo === tipo);
    return acc;
  }, {});

  const labels: Record<string, string> = {
    moodboard: "Moodboard",
    planta: "Plantas",
    render: "Renders",
    foto_cliente: "Fotos do cliente",
    entregavel: "Entregáveis",
    referencia: "Referências",
    outro: "Outros",
  };

  return (
    <div className="space-y-4">
      {TIPOS.map((tipo) => {
        const items = porTipo[tipo];
        if (items.length === 0) return null;
        const open = expandido[tipo] !== false;
        return (
          <div key={tipo} className="card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setExpandido((e) => ({ ...e, [tipo]: !open }))}
            >
              <span className="font-semibold text-sm">{labels[tipo]}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                {items.length} arquivo{items.length !== 1 ? "s" : ""} {open ? "▲" : "▼"}
              </span>
            </button>
            {open && (
              <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {items.map((arq) => (
                  <a key={arq.id} href={arq.url} target="_blank" rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border hover:shadow transition-shadow"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {arq.thumbnail_url ? (
                      <img src={arq.thumbnail_url} alt={arq.nome} className="w-full h-24 object-cover" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center text-2xl" style={{ background: "var(--bg-subtle)" }}>📄</div>
                    )}
                    <p className="px-2 py-1.5 text-xs truncate" style={{ color: "var(--text-secondary)" }}>{arq.nome}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {arquivos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <p className="empty-state-title">Nenhum arquivo</p>
          <p className="empty-state-desc">Os arquivos enviados aparecerão aqui organizados por tipo.</p>
        </div>
      )}
    </div>
  );
}
