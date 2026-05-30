"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Briefing = {
  id?: string;
  objetivo?: string | null;
  publico?: string | null;
  estilo_preferido?: string | null;
  cores_preferidas?: string | null;
  cores_evitar?: string | null;
  referencias_visuais?: string | null;
  prazo_desejado?: string | null;
  orcamento_estimado?: string | null;
  ambiente_descricao?: string | null;
  medidas_ambiente?: string | null;
  pontos_eletrica?: string | null;
  iluminacao_natural?: string | null;
  mobiliario_atual?: string | null;
  necessidades_funcionais?: string | null;
  marca_atual?: string | null;
  valores_marca?: string | null;
  diferenciais?: string | null;
  concorrentes?: string | null;
  observacoes_extras?: string | null;
};

export default function BriefingForm({
  projetoId,
  tipo,
  briefingExistente,
  studioId,
}: {
  projetoId: string;
  tipo: string;
  briefingExistente?: Briefing;
  studioId: string;
}) {
  const [form, setForm] = useState<Briefing>(briefingExistente || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof Briefing, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.objetivo) { setError("O objetivo do projeto é obrigatório."); return; }
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const payload = { ...form, projeto_id: projetoId, studio_id: studioId, enviado_em: new Date().toISOString() };
      if (briefingExistente?.id) {
        await supabase.from("briefings").update(payload).eq("id", briefingExistente.id);
      } else {
        await supabase.from("briefings").insert(payload);
        await supabase.from("projetos").update({ status: "briefing_recebido" }).eq("id", projetoId);
      }
      setSaved(true);
    } catch {
      setError("Erro ao salvar o briefing. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Objetivo do projeto *</label>
        <textarea className="textarea" value={form.objetivo || ""} onChange={(e) => set("objetivo", e.target.value)} placeholder="Descreva o objetivo principal do projeto..." />
      </div>
      <div>
        <label className="label">Público-alvo</label>
        <textarea className="textarea" value={form.publico || ""} onChange={(e) => set("publico", e.target.value)} placeholder="Quem vai usar / ver este projeto?" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Estilo preferido</label>
          <input className="input" value={form.estilo_preferido || ""} onChange={(e) => set("estilo_preferido", e.target.value)} placeholder="Ex: moderno, escandinavo, minimalista" />
        </div>
        <div>
          <label className="label">Prazo desejado</label>
          <input className="input" value={form.prazo_desejado || ""} onChange={(e) => set("prazo_desejado", e.target.value)} placeholder="Ex: 2 meses" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Cores preferidas</label>
          <input className="input" value={form.cores_preferidas || ""} onChange={(e) => set("cores_preferidas", e.target.value)} placeholder="Ex: tons neutros, verde" />
        </div>
        <div>
          <label className="label">Cores a evitar</label>
          <input className="input" value={form.cores_evitar || ""} onChange={(e) => set("cores_evitar", e.target.value)} placeholder="Ex: vermelho, roxo intenso" />
        </div>
      </div>
      <div>
        <label className="label">Referências visuais</label>
        <textarea className="textarea" value={form.referencias_visuais || ""} onChange={(e) => set("referencias_visuais", e.target.value)} placeholder="Links do Pinterest, Instagram, descrições de estilos que te inspiram..." />
      </div>
      <div>
        <label className="label">Orçamento estimado</label>
        <input className="input" value={form.orcamento_estimado || ""} onChange={(e) => set("orcamento_estimado", e.target.value)} placeholder="Ex: R$ 5.000 - R$ 8.000" />
      </div>

      {tipo === "interiores" && (
        <>
          <hr className="divider" />
          <h3>Informações do ambiente</h3>
          <div>
            <label className="label">Descrição do ambiente</label>
            <textarea className="textarea" value={form.ambiente_descricao || ""} onChange={(e) => set("ambiente_descricao", e.target.value)} placeholder="Descreva o ambiente a ser projetado..." />
          </div>
          <div>
            <label className="label">Medidas do ambiente</label>
            <textarea className="textarea" style={{ minHeight: "72px" }} value={form.medidas_ambiente || ""} onChange={(e) => set("medidas_ambiente", e.target.value)} placeholder="Ex: 4m x 5m, pé-direito 2,70m..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Pontos de elétrica</label>
              <textarea className="textarea" style={{ minHeight: "72px" }} value={form.pontos_eletrica || ""} onChange={(e) => set("pontos_eletrica", e.target.value)} placeholder="Onde ficam as tomadas, interruptores..." />
            </div>
            <div>
              <label className="label">Iluminação natural</label>
              <textarea className="textarea" style={{ minHeight: "72px" }} value={form.iluminacao_natural || ""} onChange={(e) => set("iluminacao_natural", e.target.value)} placeholder="Janelas, orientação solar, quantidade de luz..." />
            </div>
          </div>
          <div>
            <label className="label">Mobiliário atual (manter / substituir)</label>
            <textarea className="textarea" value={form.mobiliario_atual || ""} onChange={(e) => set("mobiliario_atual", e.target.value)} placeholder="O que ficará? O que será substituído?" />
          </div>
          <div>
            <label className="label">Necessidades funcionais</label>
            <textarea className="textarea" value={form.necessidades_funcionais || ""} onChange={(e) => set("necessidades_funcionais", e.target.value)} placeholder="Armazenamento, acessibilidade, uso específico..." />
          </div>
        </>
      )}

      {tipo === "grafico" && (
        <>
          <hr className="divider" />
          <h3>Informações da marca</h3>
          <div>
            <label className="label">Marca atual</label>
            <textarea className="textarea" value={form.marca_atual || ""} onChange={(e) => set("marca_atual", e.target.value)} placeholder="Descreva a marca, o que já existe, histórico..." />
          </div>
          <div>
            <label className="label">Valores da marca</label>
            <textarea className="textarea" value={form.valores_marca || ""} onChange={(e) => set("valores_marca", e.target.value)} placeholder="O que a marca representa? Quais são seus valores?" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Diferenciais</label>
              <textarea className="textarea" value={form.diferenciais || ""} onChange={(e) => set("diferenciais", e.target.value)} placeholder="O que torna esta marca única?" />
            </div>
            <div>
              <label className="label">Concorrentes</label>
              <textarea className="textarea" value={form.concorrentes || ""} onChange={(e) => set("concorrentes", e.target.value)} placeholder="Quem são os concorrentes diretos?" />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="label">Observações extras</label>
        <textarea className="textarea" value={form.observacoes_extras || ""} onChange={(e) => set("observacoes_extras", e.target.value)} placeholder="Qualquer informação adicional relevante..." />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{error}</p>}
      {saved && <p style={{ color: "var(--success)", fontSize: "0.875rem" }}>Briefing salvo com sucesso!</p>}

      <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
        {saving ? "Salvando..." : "Enviar briefing"}
      </button>
    </form>
  );
}
