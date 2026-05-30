import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Link from "next/link";

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: cliente } = await supabase.from("clientes").select("nome").eq("id", id).eq("studio_id", studio.id).single();
  if (!cliente) notFound();

  return (
    <div>
      <Topbar title="Editar cliente" breadcrumb={[{ href: "/clientes", label: "Clientes" }, { href: `/clientes/${id}`, label: cliente.nome }, { label: "Editar" }]} />
      <div className="p-8 max-w-2xl">
        <div className="card-feature p-8">
          <p style={{ color: "var(--text-muted)" }}>Formulário de edição — em breve.</p>
          <Link href={`/clientes/${id}`} className="btn btn-secondary mt-4">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
