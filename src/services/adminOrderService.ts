import { supabase } from "../lib/supabase";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type AdminOrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image_url: string | null;
  } | null;
};

export type AdminOrder = {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  items: AdminOrderItem[];
};

export async function getOrders(): Promise<AdminOrder[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const orderIds = (orders ?? []).map((order) => order.id);
  if (orderIds.length === 0) return [];

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      order_id,
      product_id,
      quantity,
      price,
      products (
        name,
        image_url
      )
    `)
    .in("order_id", orderIds);

  if (itemsError) throw itemsError;

  return (orders ?? []).map((order) => ({
    ...order,
    items: (items ?? [])
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        ...item,
        product: Array.isArray(item.products)
          ? item.products[0] ?? null
          : item.products ?? null,
      })),
  }));
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id, status")
    .single();

  if (error) throw error;
  if (!data || data.id !== orderId || data.status !== status) {
    throw new Error("La mise à jour du statut n'a pas été confirmée.");
  }
  return data;
}
