"use client";
import { useState, use } from "react";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import CurvaDecorativa from "@/components/CurvaDecorativa";
import { createClient } from "@/lib/supabase/client";

export default function BriefingPublicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", sobre: "", tipo: "interiores",
    prazo: "", orcamento: "", como_conheceu: "",
  });

  function set(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: studio } = await supabase.from("studios").select("id").eq("slug", slug).single();
    if (!studio) { setSaving(false); return; }

    const { data: cliente } = await supabase.from("clientes").upsert({
      studio_id: studio.id,
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      como_conheceu: form.como_conheceu || null,
      status: "lead",
    }, { onConflict: "email" }).select().single();

    if (cliente) {
      await supabase.from("projetos").insert({
        studio_id: studio.id,
        cliente_id: cliente.id,
        nome: `Projeto — ${form.nome}`,
        tipo: form.tipo,
        descricao: form.sobre,
        status: "aguardando_briefing",
      });
    }

    setSaving(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: "var(--bg)" }}>
        <div>
          <div className="flex justify-center mb-6"><EdenAtelierLogo size={48} /></div>
          <h1 className="font-display mb-4" style={{ fontSize: "2.5rem" }}>Obrigada!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.0625rem", maxWidth: "400px" }}>
            Recebemos seu interesse. Entraremos em contato em até 24h.
          </p>
          <div className="flex justify-center mt-6"><CurvaDecorativa width={200} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-xl mx-auto">
        <div className="flex justify-center mb-8"><EdenAtelierLogo size={40} /></div>
        <h1 className="font-display text-center mb-2" style={{ fontSize: "2rem" }}>Solicitar projeto</h1>
        <p className="text-center mb-8" style={{ color: "var(--text-muted)" }}>Conte um pouco sobre o que você precisa.</p>
        <form onSubmit={handleSubmit} className="card-feature p-8 space-y-4">
          <div>
            <label className="label">Seu nome *</label>
            <input className="input" required value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ana Carolina" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="seu@email.com" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input className="input" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(61) 99999-0000" />
            </div>
          </div>
          <div>
            <label className="label">Tipo de projeto</label>
            <select className="select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
              <option value="interiores">Design de Interiores</option>
              <option value="grafico">Design Gráfico</option>
            </select>
          </div>
          <div>
            <label className="label">Sobre o projeto</label>
            <textarea className="textarea" value={form.sobre} onChange={(e) => set("sobre", e.target.value)} placeholder="Descreva brevemente o que você precisa..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prazo desejado</label>
              <input className="input" value={form.prazo} onChange={(e) => set("prazo", e.target.value)} placeholder="Ex: 2 meses" />
            </div>
            <div>
              <label className="label">Orçamento estimado</label>
              <input className="input" value={form.orcamento} onChange={(e) => set("orcamento", e.target.value)} placeholder="Ex: R$ 5.000" />
            </div>
          </div>
          <div>
            <label className="label">Como nos conheceu?</label>
            <input className="input" value={form.como_conheceu} onChange={(e) => set("como_conheceu", e.target.value)} placeholder="Instagram, indicação..." />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
            {saving ? "Enviando..." : "Enviar solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
}
