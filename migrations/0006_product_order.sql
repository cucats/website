alter table products add column display_order int not null default 0;
update products set display_order = id;
create index products_display_order_idx on products(display_order, id);
