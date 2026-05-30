"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/format";

type Mensagem = {
  id: string;
  texto: string;
  remetente_tipo: string | null;
  remetente_user_id: string | null;
  created_at: string;
};

export default function ChatProjeto({ projetoId }: { projetoId: string }) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [studioId, setStudioId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
    supabase.from("profiles").select("studio_id").then(({ data }) => {
      if (data?.[0]?.studio_id) setStudioId(data[0].studio_id);
    });

    supabase.from("mensagens").select("*").eq("projeto_id", projetoId).order("created_at").then(({ data }) => {
      setMensagens(data || []);
    });

    const channel = supabase
      .channel(`chat-${projetoId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens", filter: `projeto_id=eq.${projetoId}` },
        (payload) => setMensagens((m) => [...m, payload.new as Mensagem])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projetoId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function send() {
    if (!texto.trim() || !studioId) return;
    const supabase = createClient();
    await supabase.from("mensagens").insert({
      projeto_id: projetoId,
      studio_id: studioId,
      remetente_user_id: userId,
      remetente_tipo: "designer",
      texto: texto.trim(),
    });
    setTexto("");
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: "400px" }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {mensagens.map((msg) => {
          const isMe = msg.remetente_user_id === userId;
          return (
            <div key={msg.id} className={`chat-msg ${isMe ? "from-me" : ""}`}>
              {!isMe && (
                <span className="avatar avatar-sm avatar-gray flex-shrink-0">{getInitials("Cliente")}</span>
              )}
              <div className="chat-msg-bubble">{msg.texto}</div>
            </div>
          );
        })}
        {mensagens.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <p className="empty-state-title">Nenhuma mensagem ainda</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
        <input
          className="input flex-1"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Digite uma mensagem..."
        />
        <button onClick={send} className="btn btn-primary" aria-label="Enviar mensagem">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
