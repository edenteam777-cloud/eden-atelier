import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import PropostaPreview from "@/components/PropostaPreview";
import Link from "next/link";

export default async function PropostaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id, nome_studio, logo_url").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: proposta } = await supabase.from("propostas").select("*, clientes(nome, email)").eq("id", id).eq("studio_id", studio.id).single();
  if (!proposta) notFound();

  const propostaComStudio = { ...proposta, studios: studio };

  return (
    <div>
      <Topbar title="Proposta" breadcrumb={[{ href: "/propostas", label: "Propostas" }, { label: proposta.titulo }]}>
        {proposta.link_compartilhavel && (
          <button
            onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase.co", "vercel.app") || ""}/${studio.nome_studio}/proposta/${proposta.link_compartilhavel}`)}
            className="btn btn-secondary"
          >
            Copiar link
          </button>
        )}
      </Topbar>
      <div className="p-8">
        <PropostaPreview proposta={propostaComStudio} />
      </div>
    </div>
  );
}
