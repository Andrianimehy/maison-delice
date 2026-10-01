create or replace function public.create_order_with_items(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_total numeric,
  p_items jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
begin
  insert into public.orders (
    customer_name, phone, email, address, total, status
  )
  values (
    p_customer_name, p_phone, p_email, p_address, p_total, 'pending'
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, quantity, price)
  select
    v_order_id,
    (item->>'product_id')::bigint,
    (item->>'quantity')::integer,
    (item->>'price')::numeric
  from jsonb_array_elements(p_items) as item;

  return v_order_id;
end;
$$;

revoke all on function public.create_order_with_items(text,text,text,text,numeric,jsonb) from public;
grant execute on function public.create_order_with_items(text,text,text,text,numeric,jsonb) to anon;
grant execute on function public.create_order_with_items(text,text,text,text,numeric,jsonb) to authenticated;
