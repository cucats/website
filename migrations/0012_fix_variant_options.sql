update variants
set options = (options #>> '{}')::jsonb
where jsonb_typeof(options) = 'string';
