"use server";
import { createClient } from "@/utils/supabase/server";

export default async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error(error);
    return
  }
}
