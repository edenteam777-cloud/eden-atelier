import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import MoodboardGrid from "@/components/MoodboardGrid";

export default async function MoodboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("id, nome").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();
  const { data: moodboards } = await supabase.from("moodboards").select("*, moodboard_itens(*)").eq("projeto_id", id);

  return (
    <div>
      <Topbar title="Moodboard" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Moodboard" }]} />
      <div className="p-8">
        {(moodboards || []).map((mb) => (
          <div key={mb.id} className="card-feature p-6 mb-6">
            <h3 className="mb-4">{mb.titulo}</h3>
            <MoodboardGrid itens={mb.moodboard_itens || []} />
          </div>
        ))}
        {(moodboards || []).length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <p className="empty-state-title">Nenhum moodboard ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
