-- A product can vary along multiple axes (Size, Colour, …). Each axis
-- has an ordered list of values. Variants are concrete combinations of
-- one value per axis.

create table product_axes (
  id serial primary key,
  product_id int not null references products(id) on delete cascade,
  name text not null,
  display_order int not null default 0,
  values text[] not null default '{}',
  unique (product_id, name)
);
create index product_axes_product_id_idx on product_axes(product_id);

-- Backfill from the single-axis world.
insert into product_axes (product_id, name)
select id, axis_name from products where axis_name is not null;

update product_axes pa
set values = coalesce(
  (
    select array_agg(distinct v.options->>pa.name)
    from variants v
    where v.product_id = pa.product_id and v.options ? pa.name
  ),
  '{}'
);

alter table products drop column axis_name;
