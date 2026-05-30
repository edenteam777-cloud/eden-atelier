import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function EditarProjetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("*").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();

  return (
    <div>
      <Topbar title="Editar projeto" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Editar" }]} />
      <div className="p-8 max-w-2xl">
        <div className="card-feature p-8">
          <p style={{ color: "var(--text-muted)" }}>Formulário de edição — em breve.</p>
          <Link href={`/projetos/${id}`} className="btn btn-secondary mt-4">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
