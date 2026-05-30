import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import ArquivosGaleria from "@/components/ArquivosGaleria";

export default async function ArquivosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("id, nome").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();
  const { data: arquivos } = await supabase.from("arquivos").select("*").eq("projeto_id", id);

  return (
    <div>
      <Topbar title="Arquivos" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Arquivos" }]} />
      <div className="p-8">
        <ArquivosGaleria arquivos={arquivos || []} />
      </div>
    </div>
  );
}
