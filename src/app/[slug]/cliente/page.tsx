import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { statusProjetoLabel, statusProjetoBadge } from "@/lib/format";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";

export default async function ClienteAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${slug}/cliente`);

  const { data: studio } = await supabase.from("studios").select("id, nome_studio").eq("slug", slug).single();
  if (!studio) notFound();

  const { data: cliente } = await supabase.from("clientes").select("id, nome").eq("studio_id", studio.id).eq("auth_user_id", user.id).single();

  const { data: projetos } = await supabase
    .from("projetos")
    .select("id, nome, status, data_entrega_prevista")
    .eq("studio_id", studio.id)
    .eq("cliente_id", cliente?.id || "")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <EdenAtelierLogo size={32} />
          <h1 className="font-display" style={{ fontSize: "1.5rem" }}>{studio.nome_studio}</h1>
        </div>
        <h2 className="mb-6">Meus projetos</h2>
        {(projetos || []).length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">Nenhum projeto ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(projetos || []).map((p) => (
              <Link key={p.id} href={`/${slug}/cliente/projetos/${p.id}`} className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-display" style={{ fontSize: "1rem" }}>{p.nome}</p>
                  <span className={`badge mt-1 ${statusProjetoBadge(p.status)}`}>{statusProjetoLabel(p.status)}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
