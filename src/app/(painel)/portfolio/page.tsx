import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function PortfolioAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id, slug").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projetos } = await supabase.from("projetos").select("id, nome, categoria, capa_url, publicar_portfolio").eq("studio_id", studio.id).eq("publicar_portfolio", true).order("created_at", { ascending: false });
  const { data: todos } = await supabase.from("projetos").select("id, nome, publicar_portfolio").eq("studio_id", studio.id).eq("publicar_portfolio", false).limit(10);

  return (
    <div>
      <Topbar title="Portfólio público">
        {studio.slug && (
          <a href={`/${studio.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Ver portfólio ↗</a>
        )}
      </Topbar>
      <div className="p-8">
        <h3 className="mb-4">Publicados no portfólio</h3>
        {(projetos || []).length === 0 ? (
          <div className="empty-state mb-8">
            <p className="empty-state-title">Nenhum projeto publicado</p>
            <p className="empty-state-desc">Marque projetos como públicos para exibi-los no portfólio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {(projetos || []).map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <div style={{ aspectRatio: "4/3", background: "var(--bg-subtle)" }}>
                  {p.capa_url ? <img src={p.capa_url} alt={p.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">✦</div>}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{p.nome}</p>
                  <Link href={`/projetos/${p.id}`} className="btn btn-ghost text-xs mt-1 w-full">Editar projeto</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {(todos || []).length > 0 && (
          <>
            <h3 className="mb-4">Não publicados</h3>
            <div className="card overflow-hidden">
              <table className="table">
                <thead><tr><th>Projeto</th><th>Ação</th></tr></thead>
                <tbody>
                  {(todos || []).map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td><Link href={`/projetos/${p.id}`} className="btn btn-secondary text-xs">Publicar →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
