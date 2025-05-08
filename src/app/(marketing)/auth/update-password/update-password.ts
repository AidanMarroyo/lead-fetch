"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const { error } = await supabase.auth.updateUser( {password} );
  if (error) {
    console.error(error);
    return
  } else{  redirect('/auth/login')}

}
