import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/store/cart";

export type OrderInput = {
  customer_name: string;
  customer_phone: string;
  delivery_location: string;
  items: CartItem[];
  notes?: string;
};

export async function saveOrder(input: OrderInput) {
  const itemsJson = input.items.map((i) => ({
    productId: i.productId,
    name: i.name,
    color: i.colorName,
    size: i.size,
    qty: i.qty,
    image: i.image,
  }));
  const item_count = input.items.reduce((n, i) => n + i.qty, 0);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      delivery_location: input.delivery_location,
      items: itemsJson,
      item_count,
      notes: input.notes ?? null,
      whatsapp_sent: true,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}
