import Link from "next/link";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import { signUp } from "./actions";

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="card-feature p-8">
          <div className="flex justify-center mb-6">
            <EdenAtelierLogo size={40} />
          </div>
          <h1 className="font-display text-center mb-6" style={{ fontSize: "1.75rem" }}>Criar studio</h1>
          {params.error && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
              {params.error}
            </div>
          )}
          <form action={signUp} className="space-y-4">
            <div>
              <label className="label" htmlFor="nome">Seu nome</label>
              <input id="nome" name="nome" type="text" required className="input" placeholder="Mariana Muratori" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="label" htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label className="label" htmlFor="confirm">Confirmar senha</label>
              <input id="confirm" name="confirm" type="password" required className="input" placeholder="Repita a senha" />
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg">Criar conta</button>
          </form>
          <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "var(--brand-600)" }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
