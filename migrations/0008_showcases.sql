-- New first-class entity: a showcase is either a time-limited drop
-- or an always-on collection. Replaces drops + the products.type='pod' flag.

create table showcases (
  id serial primary key,
  slug text not null unique,
  name text not null,
  description text,
  kind text not null check (kind in ('drop','always_on')),
  opens_at timestamptz,
  closes_at timestamptz,
  collection_event text,
  status text not null default 'draft' check (status in ('draft','open','closed','fulfilled','cancelled')),
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table showcase_products (
  showcase_id int not null references showcases(id) on delete cascade,
  product_id int not null references products(id) on delete cascade,
  display_order int not null default 0,
  primary key (showcase_id, product_id)
);
create index showcase_products_product_idx on showcase_products(product_id);

-- Copy existing drops into showcases preserving ids
insert into showcases (id, slug, name, description, kind, opens_at, closes_at, collection_event, status, created_at)
select id, slug, name, description, 'drop', opens_at, closes_at, collection_event, status, created_at
from drops;

select setval(
  'showcases_id_seq',
  greatest(coalesce((select max(id) from showcases), 0), 1)
);

-- An always-on showcase to hold the products previously typed 'pod'
insert into showcases (slug, name, description, kind, status, opens_at)
values (
  'always-on',
  'Order anytime',
  'Always available items shipped direct to you.',
  'always_on',
  'open',
  now()
);

-- Membership: drop-products map to their drop's showcase, pod products
-- map to always-on
insert into showcase_products (showcase_id, product_id, display_order)
select drop_id, id, display_order
from products
where drop_id is not null;

insert into showcase_products (showcase_id, product_id, display_order)
select (select id from showcases where slug = 'always-on'), id, display_order
from products
where type = 'pod';

-- Orders learn their showcase from their items' product → drop_id (or
-- always-on for POD)
alter table orders add column showcase_id int references showcases(id);

update orders o
set showcase_id = sub.sid
from (
  select oi.order_id,
         coalesce(p.drop_id, (select id from showcases where slug = 'always-on')) as sid
  from order_items oi
  join variants v on v.id = oi.variant_id
  join products p on p.id = v.product_id
  group by oi.order_id, p.drop_id
) sub
where o.id = sub.order_id;

-- Any pre-existing orders that didn't match (shouldn't happen, but defensively):
update orders set showcase_id = (select id from showcases where slug = 'always-on')
where showcase_id is null;

alter table orders alter column showcase_id set not null;
create index orders_showcase_id_idx on orders(showcase_id);

-- Retire the old columns/table
alter table products drop column drop_id cascade;
alter table products drop column type cascade;
drop table drops;
