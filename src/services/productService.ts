import { supabase } from "../lib/supabase";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
};

export async function getProducts(): Promise<Product[]> {
  console.log("🔎 Connexion à Supabase...");

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      price,
      image_url,
      is_available
    `)
    .eq("is_available", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("❌ Erreur Supabase :", error);
    throw error;
  }

  console.log("✅ Produits reçus :", data);

  return data ?? [];
}
