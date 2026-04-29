// utils/supabase/client.js
import { createClient } from "@supabase/supabase-js";  

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Les variables d'environnement Supabase sont manquantes");
  }

  return createClient(url, key); 
}