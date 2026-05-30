import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("*").eq("owner_user_id", user.id).single();

  return (
    <div>
      <Topbar title="Configurações" />
      <div className="p-8 max-w-3xl">
        <div className="card-feature p-8 space-y-6">
          <div>
            <h3 className="mb-4">Studio</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Nome do studio</label><input className="input" defaultValue={studio?.nome_studio || ""} readOnly /></div>
              <div><label className="label">Tipo</label><input className="input" defaultValue={studio?.tipo || ""} readOnly /></div>
              <div className="col-span-2"><label className="label">Bio</label><textarea className="textarea" defaultValue={studio?.bio || ""} readOnly /></div>
              <div><label className="label">Instagram</label><input className="input" defaultValue={studio?.instagram || ""} readOnly /></div>
              <div><label className="label">Telefone</label><input className="input" defaultValue={studio?.telefone || ""} readOnly /></div>
            </div>
          </div>
          <hr className="divider" />
          <div>
            <h3 className="mb-4">Portfólio público</h3>
            {studio?.slug && (
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--bg-subtle)" }}>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>URL:</span>
                <a href={`/${studio.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold" style={{ color: "var(--brand-600)" }}>
                  edenatelier.com/{studio.slug} ↗
                </a>
              </div>
            )}
          </div>
          <hr className="divider" />
          <div>
            <h3 className="mb-2">Notificações</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Integração com N8N para notificações automáticas via WhatsApp e email — em breve.
            </p>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
            Para editar as configurações completas, acesse as opções de cada seção diretamente nos projetos e clientes.
          </p>
        </div>
      </div>
    </div>
  );
}
