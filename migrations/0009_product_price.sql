-- Move price from per-variant to per-product. Variants are now just
-- options + stock + enabled. (order_items.price_at_order keeps
-- historical pricing intact.)

alter table products add column price numeric(10, 2) not null default 0;

update products p set price = coalesce(
  (select price from variants where product_id = p.id order by display_order, id limit 1),
  0
);

alter table variants drop column price;
