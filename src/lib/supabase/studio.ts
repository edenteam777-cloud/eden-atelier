import { createClient } from "./server";

export async function getStudio() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();
  return data ?? null;
}

export async function getStudioId(): Promise<string | null> {
  const s = await getStudio();
  if (!s?.id) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .upsert({ id: user.id, studio_id: s.id }, { onConflict: "id" });
  }
  return s.id;
}

export async function getStudioBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("studios")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

export function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
