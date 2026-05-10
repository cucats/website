alter table variants add column options jsonb not null default '{}'::jsonb;
alter table variants drop column label;
