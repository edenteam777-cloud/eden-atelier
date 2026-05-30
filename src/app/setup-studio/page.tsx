"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/format";

type FormData = {
  nome_studio: string;
  tipo: string;
  especialidade: string;
  bio: string;
  cidade: string;
  estado: string;
  instagram: string;
  telefone: string;
  atende_remoto: boolean;
  atende_presencial: boolean;
  atende_internacional: boolean;
  moeda_principal: string;
  valor_hora: string;
  valor_m2_interiores: string;
  prazo_aprovacao_dias: string;
  slug: string;
};

export default function SetupStudioPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    nome_studio: "", tipo: "interiores", especialidade: "",
    bio: "", cidade: "", estado: "", instagram: "", telefone: "",
    atende_remoto: true, atende_presencial: true, atende_internacional: false,
    moeda_principal: "BRL", valor_hora: "", valor_m2_interiores: "", prazo_aprovacao_dias: "3", slug: "",
  });

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "nome_studio" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }

  async function handleFinish() {
    if (!form.nome_studio) { setError("O nome do studio é obrigatório."); return; }
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: studio, error: err } = await supabase.from("studios").insert({
      owner_user_id: user.id,
      nome_studio: form.nome_studio,
      tipo: form.tipo,
      especialidade: form.especialidade || null,
      bio: form.bio || null,
      cidade: form.cidade || null,
      estado: form.estado || null,
      instagram: form.instagram || null,
      telefone: form.telefone || null,
      atende_remoto: form.atende_remoto,
      atende_presencial: form.atende_presencial,
      atende_internacional: form.atende_internacional,
      moeda_principal: form.moeda_principal,
      valor_hora: form.valor_hora ? parseFloat(form.valor_hora) : 0,
      valor_m2_interiores: form.valor_m2_interiores ? parseFloat(form.valor_m2_interiores) : null,
      prazo_aprovacao_dias: parseInt(form.prazo_aprovacao_dias) || 3,
      slug: form.slug || generateSlug(form.nome_studio),
    }).select().single();

    if (err) { setError("Erro ao criar o studio. Tente novamente."); setSaving(false); return; }

    await supabase.from("profiles").upsert({ id: user.id, studio_id: studio.id }, { onConflict: "id" });
    router.push("/dashboard");
  }

  const steps = [
    { label: "Identidade" },
    { label: "Sobre" },
    { label: "Atendimento" },
    { label: "Comercial" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8"><EdenAtelierLogo size={36} /></div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
                style={{
                  background: step === i + 1 ? "var(--brand-500)" : step > i + 1 ? "var(--leaf-500)" : "var(--bg-subtle)",
                  color: step >= i + 1 ? "#fff" : "var(--text-muted)",
                }}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px" style={{ background: "var(--border)" }} />}
            </div>
          ))}
        </div>

        <div className="card-feature p-8">
          <h2 className="mb-6 text-center">{steps[step - 1].label}</h2>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="nome_studio">Nome do studio *</label>
                <input id="nome_studio" className="input" value={form.nome_studio} onChange={(e) => set("nome_studio", e.target.value)} placeholder="Studio Mura" />
              </div>
              <div>
                <label className="label">Tipo de trabalho</label>
                <select className="select" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
                  <option value="interiores">Design de Interiores</option>
                  <option value="grafico">Design Gráfico</option>
                  <option value="misto">Interiores & Gráfico</option>
                </select>
              </div>
              <div>
                <label className="label">Especialidade</label>
                <input className="input" value={form.especialidade} onChange={(e) => set("especialidade", e.target.value)} placeholder="Ex: design infantil, branding, comercial" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label">Bio do studio</label>
                <textarea className="textarea" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Conte sobre seu trabalho, estilo e abordagem..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Cidade</label>
                  <input className="input" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} placeholder="Brasília" />
                </div>
                <div>
                  <label className="label">Estado</label>
                  <input className="input" value={form.estado} onChange={(e) => set("estado", e.target.value)} placeholder="DF" maxLength={2} />
                </div>
              </div>
              <div>
                <label className="label">Instagram</label>
                <input className="input" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@studiomura" />
              </div>
              <div>
                <label className="label">Telefone / WhatsApp</label>
                <input className="input" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(61) 99999-0000" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {[
                { key: "atende_remoto" as const, label: "Atendimento remoto" },
                { key: "atende_presencial" as const, label: "Atendimento presencial" },
                { key: "atende_internacional" as const, label: "Atendimento internacional" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</span>
                </label>
              ))}
              <div>
                <label className="label">Moeda principal</label>
                <select className="select" value={form.moeda_principal} onChange={(e) => set("moeda_principal", e.target.value)}>
                  <option value="BRL">BRL — Real brasileiro</option>
                  <option value="USD">USD — Dólar americano</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valor/hora padrão</label>
                  <input className="input" type="number" min="0" step="0.01" value={form.valor_hora} onChange={(e) => set("valor_hora", e.target.value)} placeholder="0.00" />
                </div>
                {form.tipo !== "grafico" && (
                  <div>
                    <label className="label">Valor por m²</label>
                    <input className="input" type="number" min="0" step="0.01" value={form.valor_m2_interiores} onChange={(e) => set("valor_m2_interiores", e.target.value)} placeholder="0.00" />
                  </div>
                )}
              </div>
              <div>
                <label className="label">Prazo padrão para aprovação (dias)</label>
                <input className="input" type="number" min="1" value={form.prazo_aprovacao_dias} onChange={(e) => set("prazo_aprovacao_dias", e.target.value)} />
              </div>
              <div>
                <label className="label">Slug do portfólio público</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>edenatelier.com/</span>
                  <input className="input flex-1" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="studio-mura" />
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>URL pública do seu portfólio.</p>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn btn-secondary">Voltar</button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="btn btn-primary">Próximo</button>
            ) : (
              <button onClick={handleFinish} className="btn btn-primary" disabled={saving}>
                {saving ? "Criando..." : "Concluir"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
