import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import ProjetoTimeline from "@/components/ProjetoTimeline";

export default async function EtapasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("id, nome").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();
  const { data: etapas } = await supabase.from("etapas").select("*").eq("projeto_id", id).order("ordem");

  return (
    <div>
      <Topbar title="Etapas" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Etapas" }]} />
      <div className="p-8 max-w-3xl">
        <div className="card-feature p-8">
          <ProjetoTimeline etapas={etapas || []} />
        </div>
      </div>
    </div>
  );
}
