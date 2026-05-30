import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import ChatProjeto from "@/components/ChatProjeto";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: studio } = await supabase.from("studios").select("id").eq("owner_user_id", user.id).single();
  if (!studio) return null;
  const { data: projeto } = await supabase.from("projetos").select("id, nome").eq("id", id).eq("studio_id", studio.id).single();
  if (!projeto) notFound();

  return (
    <div className="flex flex-col h-screen">
      <Topbar title="Chat" breadcrumb={[{ href: "/projetos", label: "Projetos" }, { href: `/projetos/${id}`, label: projeto.nome }, { label: "Chat" }]} />
      <div className="flex-1 overflow-hidden p-8">
        <div className="card overflow-hidden h-full">
          <ChatProjeto projetoId={id} />
        </div>
      </div>
    </div>
  );
}
