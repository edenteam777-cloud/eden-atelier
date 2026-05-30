"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) {
    redirect("/cadastro?error=" + encodeURIComponent("As senhas não coincidem."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });

  if (error) {
    redirect("/cadastro?error=" + encodeURIComponent(error.message));
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      nome,
      role: "admin",
    }, { onConflict: "id" });
  }

  redirect("/setup-studio");
}
