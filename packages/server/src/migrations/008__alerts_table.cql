CREATE TABLE IF NOT EXISTS clever_chain.alerts(
   id uuid,
   match_id uuid,
   alert_type text,
   constant_val varchar,
   customer_id uuid,
   match varchar,
   match_description text,
   match_numeric int,
   type varchar,
   entity_type varchar,
   name varchar,
   bridger_updated timestamp,
   database varchar,
   old_match varchar,
   category varchar,
   subcategory varchar,
   old_categories text,
   new_categories text,
   comments text,
   mapped_entity_details text,
   created_at timestamp,
   updated_at timestamp,
   deleted_at timestamp,
   created_by uuid,
   updated_by uuid,
   deleted_by uuid,
   is_deleted boolean,
   PRIMARY KEY (constant_val, created_at, id))
   WITH CLUSTERING ORDER BY (created_at DESC, id DESC);




