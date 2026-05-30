import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import BriefingForm from "@/components/BriefingForm";

export default async function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("id, nome, tipo").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();
  const { data: briefing } = await supabase.from("briefings").select("*").eq("projeto_id", id).single();

  return (
    <div>
      <Topbar title="Briefing" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Briefing" }]} />
      <div className="p-8 max-w-3xl">
        <div className="card-feature p-8">
          <BriefingForm projetoId={id} tipo={projeto.tipo || "interiores"} briefingExistente={briefing || undefined} studioId={studio.id} />
        </div>
      </div>
    </div>
  );
}
