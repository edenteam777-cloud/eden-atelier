import Link from "next/link";
import EdenAtelierLogo from "@/components/EdenAtelierLogo";
import { signIn } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; redirect?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="card-feature p-8">
          <div className="flex justify-center mb-6">
            <EdenAtelierLogo size={40} />
          </div>
          <h1 className="font-display text-center mb-6" style={{ fontSize: "1.75rem" }}>Entrar</h1>
          {params.error && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
              {params.error}
            </div>
          )}
          <form action={signIn} className="space-y-4">
            <input type="hidden" name="redirect" value={params.redirect || "/dashboard"} />
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="label" htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg">Entrar</button>
          </form>
          <div className="mt-5 flex flex-col items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link href="/recuperar-senha" style={{ color: "var(--brand-600)" }}>Esqueci minha senha</Link>
            <Link href="/cadastro" style={{ color: "var(--text-secondary)" }}>Criar studio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
