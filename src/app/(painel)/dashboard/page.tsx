import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { formatCurrency, statusProjetoLabel, statusProjetoBadge } from "@/lib/format";
import { RevenueChart } from "@/components/charts/DashboardCharts";
import CurvaDecorativa from "@/components/CurvaDecorativa";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: studio } = await supabase
    .from("studios")
    .select("id, nome_studio, moeda_principal")
    .eq("owner_user_id", user.id)
    .single();

  if (!studio) return null;
  const sid = studio.id;
  const moeda = studio.moeda_principal || "BRL";

  const now = new Date();
  const mesInicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const mesFim = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const [
    { data: projAtivos },
    { data: receitaMes },
    { count: totalClientes },
    { data: propostasPendentes },
    { data: recentProjetos },
    { data: transacoesMeses },
  ] = await Promise.all([
    supabase.from("projetos").select("id, nome, status, data_entrega_prevista, valor_total, moeda, clientes(nome)").eq("studio_id", sid).not("status", "in", '("concluido","cancelado")'),
    supabase.from("transacoes").select("valor").eq("studio_id", sid).eq("tipo", "receita").gte("data", mesInicio).lte("data", mesFim),
    supabase.from("clientes").select("id", { count: "exact", head: true }).eq("studio_id", sid).eq("status", "ativo"),
    supabase.from("propostas").select("id", { count: "exact", head: true }).eq("studio_id", sid).eq("status", "enviada"),
    supabase.from("projetos").select("id, nome, status, data_entrega_prevista").eq("studio_id", sid).not("status", "in", '("concluido","cancelado")').order("created_at", { ascending: false }).limit(5),
    supabase.from("transacoes").select("valor, data").eq("studio_id", sid).eq("tipo", "receita").gte("data", new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split("T")[0]),
  ]);

  const totalReceita = (receitaMes || []).reduce((s, t) => s + (t.valor || 0), 0);
  const totalAtivos = projAtivos?.length || 0;

  const mesesData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const mes = d.toLocaleDateString("pt-BR", { month: "short" });
    const valor = (transacoesMeses || [])
      .filter((t) => t.data?.startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`))
      .reduce((s, t) => s + (t.valor || 0), 0);
    return { mes, valor };
  });

  const { data: profile } = await supabase.from("profiles").select("nome").eq("id", user.id).single();
  const nomePrimeiro = profile?.nome?.split(" ")[0] || "Designer";

  return (
    <div>
      <Topbar title={`Olá, ${nomePrimeiro}`} subtitle="Visão geral do seu studio" />
      <div className="p-8">
        {totalAtivos === 0 ? (
          <div className="card-feature p-12 text-center">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
            <h2 className="mb-2">Bem-vindo ao Eden Atelier</h2>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>Comece criando seu primeiro projeto.</p>
            <Link href="/projetos/novo" className="btn btn-primary btn-lg">Criar primeiro projeto</Link>
            <div className="flex justify-center mt-6"><CurvaDecorativa /></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <p className="stat-label">Projetos ativos</p>
                <p className="stat-value">{totalAtivos}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Receita do mês</p>
                <p className="stat-value" style={{ fontSize: "1.5rem" }}>{formatCurrency(totalReceita, moeda)}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Clientes ativos</p>
                <p className="stat-value">{totalClientes ?? 0}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Propostas pendentes</p>
                <p className="stat-value">{propostasPendentes?.length ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="mb-4">Em andamento</h3>
                {(recentProjetos || []).map((p) => (
                  <Link key={p.id} href={`/projetos/${p.id}`} className="flex items-center justify-between py-2 hover:opacity-70 transition-opacity" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p className="font-semibold text-sm">{p.nome}</p>
                      <span className={`badge ${statusProjetoBadge(p.status)}`}>{statusProjetoLabel(p.status)}</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </Link>
                ))}
              </div>
              <div className="card p-6">
                <h3 className="mb-4">Receita — últimos 6 meses</h3>
                <RevenueChart data={mesesData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
