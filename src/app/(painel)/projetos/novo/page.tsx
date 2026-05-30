"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { createClient } from "@/lib/supabase/client";

type Cliente = { id: string; nome: string };

export default function NovoProjeto() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [studioId, setStudioId] = useState("");
  const [form, setForm] = useState({
    cliente_id: "",
    nome: "",
    tipo: "interiores",
    ambiente: "",
    area_m2: "",
    categoria: "",
    modalidade: "remoto",
    valor_total: "",
    moeda: "BRL",
    data_entrega_prevista: "",
    limite_revisoes: "3",
    descricao: "",
  });

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

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.cliente_id) { setError("Nome e cliente são obrigatórios."); return; }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: proj, error: err } = await supabase.from("projetos").insert({
      studio_id: studioId,
      cliente_id: form.cliente_id,
      nome: form.nome,
      tipo: form.tipo,
      ambiente: form.ambiente || null,
      area_m2: form.area_m2 ? parseFloat(form.area_m2) : null,
      categoria: form.categoria || null,
      modalidade: form.modalidade,
      valor_total: form.valor_total ? parseFloat(form.valor_total) : null,
      moeda: form.moeda,
      data_entrega_prevista: form.data_entrega_prevista || null,
      limite_revisoes: parseInt(form.limite_revisoes) || 3,
      descricao: form.descricao || null,
    }).select().single();

    if (err || !proj) { setError("Erro ao criar projeto."); setSaving(false); return; }

    const etapasPadrao = [
      { ordem: 1, nome: "Briefing", percentual_pagamento: 20 },
      { ordem: 2, nome: "Conceito + Moodboard", percentual_pagamento: 20 },
      { ordem: 3, nome: "Desenvolvimento", percentual_pagamento: 30 },
      { ordem: 4, nome: "Revisões e Ajustes", percentual_pagamento: 20 },
      { ordem: 5, nome: "Entrega Final", percentual_pagamento: 10 },
    ];
    await supabase.from("etapas").insert(
      etapasPadrao.map((e) => ({ ...e, studio_id: studioId, projeto_id: proj.id }))
    );

    router.push(`/projetos/${proj.id}`);
  }

  return (
    <div>
      <Topbar title="Novo projeto" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { label: "Novo" }]} />
      <div className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="card-feature p-8 space-y-5">
          <div>
            <label className="label" htmlFor="cliente_id">Cliente *</label>
            <select id="cliente_id" className="select" value={form.cliente_id} onChange={(e) => set("cliente_id", e.target.value)} required>
              <option value="">Selecionar cliente...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <Link href="/clientes/novo" className="text-xs mt-1 inline-block" style={{ color: "var(--brand-600)" }}>+ Novo cliente</Link>
          </div>
          <div>
            <label className="label" htmlFor="nome">Nome do projeto *</label>
            <input id="nome" className="input" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Quarto Infantil — Beatriz" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select className="select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
                <option value="interiores">Interiores</option>
                <option value="grafico">Gráfico</option>
              </select>
            </div>
            <div>
              <label className="label">Modalidade</label>
              <select className="select" value={form.modalidade} onChange={(e) => set("modalidade", e.target.value)}>
                <option value="remoto">Remoto</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>
          {form.tipo === "interiores" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Ambiente</label>
                <input className="input" value={form.ambiente} onChange={(e) => set("ambiente", e.target.value)} placeholder="quarto, sala, cozinha..." />
              </div>
              <div>
                <label className="label">Área (m²)</label>
                <input className="input" type="number" min="0" step="0.01" value={form.area_m2} onChange={(e) => set("area_m2", e.target.value)} placeholder="12.5" />
              </div>
            </div>
          )}
          <div>
            <label className="label">Categoria</label>
            <input className="input" value={form.categoria} onChange={(e) => set("categoria", e.target.value)} placeholder="quarto-infantil, branding, comercial..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Valor total</label>
              <input className="input" type="number" min="0" step="0.01" value={form.valor_total} onChange={(e) => set("valor_total", e.target.value)} placeholder="0.00" />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Entrega prevista</label>
              <input className="input" type="date" value={form.data_entrega_prevista} onChange={(e) => set("data_entrega_prevista", e.target.value)} />
            </div>
            <div>
              <label className="label">Limite de revisões</label>
              <input className="input" type="number" min="1" value={form.limite_revisoes} onChange={(e) => set("limite_revisoes", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="textarea" value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Descreva o projeto..." />
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
            {saving ? "Criando..." : "Criar projeto"}
          </button>
        </form>
      </div>
    </div>
  );
}
