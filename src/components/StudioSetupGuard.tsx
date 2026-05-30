import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudioSetupGuard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: studio } = await supabase
    .from("studios")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (!studio) {
    redirect("/setup-studio");
  }

  return null;
}
