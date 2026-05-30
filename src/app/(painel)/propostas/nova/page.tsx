"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import { createClient } from "@/lib/supabase/client";

type Cliente = { id: string; nome: string };

export default function NovaPropostaPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [saving, setSaving] = useState(false);
  const [studioId, setStudioId] = useState("");
  const [form, setForm] = useState({ cliente_id: "", titulo: "", escopo: "", valor_total: "", moeda: "BRL", forma_pagamento: "", prazo_estimado_dias: "", validade_dias: "7" });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("studios").select("id").eq("owner_user_id", user.id).single().then(({ data: s }) => {
        if (s) {
          setStudioId(s.id);
          supabase.from("clientes").select("id, nome").eq("studio_id", s.id).order("nome").then(({ data }) => setClientes(data || []));
        }
      });
    });
  }, []);

  function set(f: string, v: string) { setForm((prev) => ({ ...prev, [f]: v })); }

  async function handleSave(enviar: boolean) {
    if (!form.titulo || !form.cliente_id || !form.valor_total) return;
    setSaving(true);
    const supabase = createClient();
    const link = enviar ? crypto.randomUUID() : null;
    const { data } = await supabase.from("propostas").insert({
      studio_id: studioId,
      cliente_id: form.cliente_id,
      titulo: form.titulo,
      escopo: form.escopo || null,
      valor_total: parseFloat(form.valor_total),
      moeda: form.moeda,
      forma_pagamento: form.forma_pagamento || null,
      prazo_estimado_dias: form.prazo_estimado_dias ? parseInt(form.prazo_estimado_dias) : null,
      validade_dias: parseInt(form.validade_dias) || 7,
      status: enviar ? "enviada" : "rascunho",
      link_compartilhavel: link,
      enviada_em: enviar ? new Date().toISOString() : null,
    }).select().single();
    if (data) router.push(`/propostas/${data.id}`);
    else setSaving(false);
  }

  return (
    <div>
      <Topbar title="Nova proposta" breadcrumb={[{ href: "/propostas", label: "Propostas" }, { label: "Nova" }]} />
      <div className="p-8 max-w-2xl">
        <div className="card-feature p-8 space-y-5">
          <div>
            <label className="label">Cliente *</label>
            <select className="select" value={form.cliente_id} onChange={(e) => set("cliente_id", e.target.value)}>
              <option value="">Selecionar...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Título *</label>
            <input className="input" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Proposta — Quarto Infantil" />
          </div>
          <div>
            <label className="label">Escopo</label>
            <textarea className="textarea" value={form.escopo} onChange={(e) => set("escopo", e.target.value)} placeholder="Descreva o escopo do projeto..." style={{ minHeight: "140px" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Valor total *</label>
              <input className="input" type="number" min="0" step="0.01" value={form.valor_total} onChange={(e) => set("valor_total", e.target.value)} />
            </div>
            <div>
              <label className="label">Moeda</label>
              <select className="select" value={form.moeda} onChange={(e) => set("moeda", e.target.value)}>
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Forma de pagamento</label>
            <input className="input" value={form.forma_pagamento} onChange={(e) => set("forma_pagamento", e.target.value)} placeholder="Ex: 50% início, 50% entrega" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prazo (dias)</label>
              <input className="input" type="number" min="1" value={form.prazo_estimado_dias} onChange={(e) => set("prazo_estimado_dias", e.target.value)} />
            </div>
            <div>
              <label className="label">Validade (dias)</label>
              <input className="input" type="number" min="1" value={form.validade_dias} onChange={(e) => set("validade_dias", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSave(false)} className="btn btn-secondary flex-1" disabled={saving}>Salvar rascunho</button>
            <button onClick={() => handleSave(true)} className="btn btn-primary flex-1" disabled={saving}>Enviar proposta</button>
          </div>
        </div>
      </div>
    </div>
  );
}
