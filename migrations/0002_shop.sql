create table drops (
  id serial primary key,
  slug text not null unique,
  name text not null,
  description text,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  collection_event text,
  status text not null default 'draft' check (status in ('draft','open','closed','fulfilled','cancelled')),
  created_at timestamptz not null default now()
);

create table products (
  id serial primary key,
  drop_id int references drops(id) on delete cascade,
  type text not null check (type in ('drop','pod')),
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  check ((type = 'drop' and drop_id is not null) or (type = 'pod' and drop_id is null))
);

create index products_drop_id_idx on products(drop_id);

create table variants (
  id serial primary key,
  product_id int not null references products(id) on delete cascade,
  label text not null,
  price_pence int not null check (price_pence >= 0),
  stock_count int,
  created_at timestamptz not null default now()
);

create index variants_product_id_idx on variants(product_id);

create table orders (
  id serial primary key,
  reference text not null unique,
  user_id uuid not null references users(id),
  type text not null check (type in ('drop','pod')),
  status text not null default 'pending' check (status in ('pending','paid','ready','collected','shipped','delivered','cancelled')),
  total_pence int not null,
  shipping_address jsonb,
  bank_reference text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  ready_at timestamptz,
  shipped_at timestamptz,
  collected_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz
);

create index orders_user_id_idx on orders(user_id);

create table order_items (
  id serial primary key,
  order_id int not null references orders(id) on delete cascade,
  variant_id int not null references variants(id),
  qty int not null check (qty > 0),
  price_pence_at_order int not null
);

create index order_items_order_id_idx on order_items(order_id);
