import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PropostaPreview from "@/components/PropostaPreview";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";

export default async function PropostaPublicaPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const { data: studio } = await supabase.from("studios").select("id, nome_studio, logo_url").eq("slug", slug).single();
  if (!studio) notFound();

  const { data: proposta } = await supabase
    .from("propostas")
    .select("*, clientes(nome, email)")
    .eq("studio_id", studio.id)
    .eq("link_compartilhavel", id)
    .single();
  if (!proposta) notFound();

  if (!proposta.visualizada_em) {
    await supabase.from("propostas").update({ visualizada_em: new Date().toISOString() }).eq("id", proposta.id);
  }

  async function aceitarProposta() {
    "use server";
    const supabase2 = await createClient();
    await supabase2.from("propostas").update({ status: "aprovada", respondida_em: new Date().toISOString() }).eq("id", proposta.id);
  }

  const propostaComStudio = { ...proposta, studios: studio };

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: "var(--bg)" }}>
      <div className="flex justify-center mb-8">
        <EdenAtelierLogo size={36} />
      </div>
      <PropostaPreview proposta={propostaComStudio} />
      {proposta.status === "enviada" && (
        <div className="max-w-2xl mx-auto mt-6 flex gap-4">
          <form action={aceitarProposta} className="flex-1">
            <button type="submit" className="btn btn-primary btn-lg w-full">Aceitar proposta</button>
          </form>
          <a href={`mailto:${studio.nome_studio}`} className="btn btn-secondary btn-lg flex-1">Solicitar alteração</a>
        </div>
      )}
      {proposta.status === "aprovada" && (
        <div className="max-w-2xl mx-auto mt-6 text-center p-4 rounded-xl" style={{ background: "var(--success-bg)", color: "var(--success)" }}>
          Proposta aceita! Entraremos em contato em breve.
        </div>
      )}
    </div>
  );
}
