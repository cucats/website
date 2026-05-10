alter table variants add column enabled boolean not null default true;
alter table variants add column display_order int not null default 0;
update variants set display_order = id;
create index variants_display_order_idx on variants(product_id, display_order, id);
