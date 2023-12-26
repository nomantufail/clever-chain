CREATE TABLE IF NOT EXISTS clever_chain.match_report(
   id uuid,
   job_entity_id uuid,
   full_report text,
   constant_val varchar,
   created_at timestamp,
   updated_at timestamp,
   deleted_at timestamp,
   created_by uuid,
   updated_by uuid,
   deleted_by uuid,
   PRIMARY KEY(constant_val, job_entity_id, id)
   );
