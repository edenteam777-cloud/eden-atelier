import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function FornecedoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: fornecedores } = await supabase.from("fornecedores").select("*").eq("studio_id", studio.id).order("nome");

  return (
    <div>
      <Topbar title="Fornecedores">
        <Link href="/fornecedores/novo" className="btn btn-primary">+ Adicionar</Link>
      </Topbar>
      <div className="p-8">
        {(fornecedores || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏪</div>
            <p className="empty-state-title">Nenhum fornecedor ainda</p>
            <Link href="/fornecedores/novo" className="btn btn-primary mt-4">Adicionar fornecedor</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(fornecedores || []).map((f) => (
              <div key={f.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="font-display" style={{ fontSize: "1rem" }}>{f.nome}</p>
                  {f.faixa_preco && <span className="badge badge-accent">{f.faixa_preco}</span>}
                </div>
                {f.categoria && <span className="badge badge-gray mb-2">{f.categoria}</span>}
                {f.cidade && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>📍 {f.cidade}</p>}
                {f.avaliacao > 0 && (
                  <p className="text-xs mt-1" style={{ color: "var(--accent-500)" }}>{"★".repeat(f.avaliacao)}{"☆".repeat(5 - f.avaliacao)}</p>
                )}
                <div className="flex gap-2 mt-3">
                  {f.instagram && <a href={`https://instagram.com/${f.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs">Instagram</a>}
                  {f.site && <a href={f.site} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs">Site</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
