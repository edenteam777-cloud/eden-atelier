"use client";
import { useState } from "react";
import Link from "next/link";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="card-feature p-8">
          <div className="flex justify-center mb-6"><EdenAtelierLogo size={40} /></div>
          <h1 className="font-display text-center mb-2" style={{ fontSize: "1.75rem" }}>Recuperar senha</h1>
          {sent ? (
            <div className="text-center">
              <p className="mb-4 text-sm" style={{ color: "var(--success)" }}>Email enviado! Verifique sua caixa de entrada.</p>
              <Link href="/login" className="btn btn-secondary">Voltar ao login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Enviaremos um link para redefinir sua senha.</p>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
              {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
              <button type="submit" className="btn btn-primary w-full">Enviar link</button>
              <Link href="/login" className="btn btn-ghost w-full">Voltar</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
