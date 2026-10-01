import { supabase } from "../lib/supabase";
import type { CartItem } from "./cartStore";

export type CreateOrderData = {
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  items: CartItem[];
};

type ProductPriceRow = {
  id: number;
  price: number;
  is_available: boolean;
};

export async function createOrder({
  customer_name,
  phone,
  email,
  address,
  items,
}: CreateOrderData) {
  if (items.length === 0) {
    throw new Error("Le panier est vide.");
  }

  const productIds = items.map((item) => item.product.id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, is_available")
    .in("id", productIds);

  if (productsError) {
    console.error("❌ Erreur vérification produits :", productsError);
    throw productsError;
  }

  const priceById = new Map(
    ((products ?? []) as ProductPriceRow[]).map((product) => [
      product.id,
      product,
    ])
  );

  const validatedItems = items.map((item) => {
    const product = priceById.get(item.product.id);

    if (!product || !product.is_available) {
      throw new Error(`Le produit « ${item.product.name} » n'est plus disponible.`);
    }

    return {
      productId: product.id,
      quantity: Math.max(1, Math.floor(item.quantity)),
      price: Number(product.price),
    };
  });

  const total = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const rpcItems = validatedItems.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { data: orderId, error: orderError } = await supabase.rpc(
    "create_order_with_items",
    {
      p_customer_name: customer_name.trim(),
      p_phone: phone.trim(),
      p_email: email?.trim() || null,
      p_address: address?.trim() || null,
      p_total: total,
      p_items: rpcItems,
    }
  );

  if (orderError) {
    console.error("❌ Erreur création commande :", orderError);
    throw orderError;
  }

  return { id: orderId, total };
}
