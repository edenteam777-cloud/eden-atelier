import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function MoodboardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: moodboards } = await supabase
    .from("moodboards")
    .select("*, projetos(nome), moodboard_itens(imagem_url)")
    .eq("studio_id", studio.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Topbar title="Moodboards" />
      <div className="p-8">
        {(moodboards || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <p className="empty-state-title">Nenhum moodboard ainda</p>
            <p className="empty-state-desc">Moodboards são criados dentro dos projetos.</p>
            <Link href="/projetos" className="btn btn-primary mt-4">Ver projetos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(moodboards || []).map((mb) => {
              const capa = (mb.moodboard_itens as Array<{ imagem_url: string }>)?.[0]?.imagem_url;
              const projeto = mb.projetos as { nome: string } | null;
              return (
                <div key={mb.id} className="card overflow-hidden">
                  <div style={{ aspectRatio: "16/9", background: "var(--bg-subtle)" }}>
                    {capa ? <img src={capa} alt={mb.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div>}
                  </div>
                  <div className="p-4">
                    <p className="font-display" style={{ fontSize: "1rem" }}>{mb.titulo}</p>
                    {projeto && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{projeto.nome}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
