-- Make the axis explicit on the product. A variant's options stay as
-- {axis_name: value}, but the admin UI now treats it as an axis + a
-- choice within that axis.

alter table products add column axis_name text;

-- Backfill from existing variants: pick the first jsonb key
update products p set axis_name = sub.k
from (
  select v.product_id, min(k) as k
  from variants v, jsonb_object_keys(v.options) as k
  group by v.product_id
) sub
where p.id = sub.product_id;
