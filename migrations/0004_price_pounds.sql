alter table variants rename column price_pence to price;
alter table variants alter column price drop default;
alter table variants alter column price type numeric(10, 2) using price::numeric / 100;
alter table variants drop constraint variants_price_pence_check;
alter table variants add constraint variants_price_check check (price >= 0);

alter table orders rename column total_pence to total;
alter table orders alter column total type numeric(10, 2) using total::numeric / 100;

alter table order_items rename column price_pence_at_order to price_at_order;
alter table order_items alter column price_at_order type numeric(10, 2) using price_at_order::numeric / 100;
