"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import { createClient } from "@/lib/supabase/client";

export default function NovoFornecedorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [studioId, setStudioId] = useState("");
  const [form, setForm] = useState({ nome: "", categoria: "", cidade: "", site: "", instagram: "", contato_nome: "", contato_telefone: "", contato_email: "", faixa_preco: "$", avaliacao: "0", observacoes: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("studios").select("id").eq("owner_user_id", user.id).single().then(({ data: s }) => { if (s) setStudioId(s.id); });
    });
  }, []);

  function set(f: string, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("fornecedores").insert({ studio_id: studioId, nome: form.nome, categoria: form.categoria || null, cidade: form.cidade || null, site: form.site || null, instagram: form.instagram || null, contato_nome: form.contato_nome || null, contato_telefone: form.contato_telefone || null, contato_email: form.contato_email || null, faixa_preco: form.faixa_preco, avaliacao: parseInt(form.avaliacao), observacoes: form.observacoes || null });
    router.push("/fornecedores");
  }

  return (
    <div>
      <Topbar title="Novo fornecedor" breadcrumb={[{ href: "/fornecedores", label: "Fornecedores" }, { label: "Novo" }]} />
      <div className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="card-feature p-8 space-y-4">
          <div><label className="label">Nome *</label><input className="input" required value={form.nome} onChange={(e) => set("nome", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Categoria</label>
              <select className="select" value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                <option value="">Selecionar...</option>
                {["moveis","iluminacao","decoracao","acabamentos","tipografia","grafica","impressao","outro"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Cidade</label><input className="input" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Site</label><input className="input" value={form.site} onChange={(e) => set("site", e.target.value)} placeholder="https://..." /></div>
            <div><label className="label">Instagram</label><input className="input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Faixa de preço</label>
              <select className="select" value={form.faixa_preco} onChange={(e) => set("faixa_preco", e.target.value)}>
                <option value="$">$ Acessível</option>
                <option value="$$">$$ Médio</option>
                <option value="$$$">$$$ Premium</option>
              </select>
            </div>
            <div><label className="label">Avaliação (0-5)</label><input className="input" type="number" min="0" max="5" value={form.avaliacao} onChange={(e) => set("avaliacao", e.target.value)} /></div>
          </div>
          <div><label className="label">Observações</label><textarea className="textarea" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} /></div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>{saving ? "Salvando..." : "Salvar fornecedor"}</button>
        </form>
      </div>
    </div>
  );
}
