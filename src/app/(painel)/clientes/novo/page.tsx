"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import PhoneInput from "@/components/PhoneInput";
import { createClient } from "@/lib/supabase/client";

export default function NovoClientePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [studioId, setStudioId] = useState("");
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", empresa: "", cpf_cnpj: "",
    endereco: "", cidade: "", estado: "", pais: "Brasil", moeda: "BRL",
    como_conheceu: "", status: "lead", observacoes: "", tagsInput: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("studios").select("id").eq("owner_user_id", user.id).single().then(({ data: s }) => {
        if (s) setStudioId(s.id);
      });
    });
  }, []);

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome) { setError("Nome é obrigatório."); return; }
    setSaving(true);
    const supabase = createClient();
    const tags = form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const { error: err } = await supabase.from("clientes").insert({
      studio_id: studioId,
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      empresa: form.empresa || null,
      cpf_cnpj: form.cpf_cnpj || null,
      endereco: form.endereco || null,
      cidade: form.cidade || null,
      estado: form.estado || null,
      pais: form.pais,
      moeda: form.moeda,
      como_conheceu: form.como_conheceu || null,
      status: form.status,
      observacoes: form.observacoes || null,
      tags: tags.length > 0 ? tags : null,
    });
    if (err) { setError("Erro ao salvar."); setSaving(false); return; }
    router.push("/clientes");
  }

  return (
    <div>
      <Topbar title="Novo cliente" breadcrumb={[{ href: "/clientes", label: "Clientes" }, { label: "Novo" }]} />
      <div className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="card-feature p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Nome *</label>
              <input className="input" value={form.nome} onChange={(e) => set("nome", e.target.value)} required placeholder="Ana Carolina Silva" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ana@email.com" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <PhoneInput value={form.telefone} onChange={(v) => set("telefone", v)} />
            </div>
            <div>
              <label className="label">Empresa</label>
              <input className="input" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} placeholder="Empresa Ltda" />
            </div>
            <div>
              <label className="label">CPF / CNPJ</label>
              <input className="input" value={form.cpf_cnpj} onChange={(e) => set("cpf_cnpj", e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Endereço</label>
              <input className="input" value={form.endereco} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua..." />
            </div>
            <div>
              <label className="label">Cidade</label>
              <input className="input" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </div>
            <div>
              <label className="label">Estado</label>
              <input className="input" value={form.estado} onChange={(e) => set("estado", e.target.value)} maxLength={2} placeholder="DF" />
            </div>
            <div>
              <label className="label">País</label>
              <input className="input" value={form.pais} onChange={(e) => set("pais", e.target.value)} />
            </div>
            <div>
              <label className="label">Moeda</label>
              <select className="select" value={form.moeda} onChange={(e) => set("moeda", e.target.value)}>
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="lead">Lead</option>
                <option value="qualificado">Qualificado</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="encerrado">Encerrado</option>
              </select>
            </div>
            <div>
              <label className="label">Como conheceu</label>
              <input className="input" value={form.como_conheceu} onChange={(e) => set("como_conheceu", e.target.value)} placeholder="Instagram, indicação..." />
            </div>
            <div className="md:col-span-2">
              <label className="label">Tags (separadas por vírgula)</label>
              <input className="input" value={form.tagsInput} onChange={(e) => set("tagsInput", e.target.value)} placeholder="quarto-infantil, expatriado, reforma" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Observações</label>
              <textarea className="textarea" value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
            </div>
          </div>
          {error && <p style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={saving}>
            {saving ? "Salvando..." : "Salvar cliente"}
          </button>
        </form>
      </div>
    </div>
  );
}
