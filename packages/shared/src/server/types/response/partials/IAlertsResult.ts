export default interface IAlertsResult {
  id: string
  match_id: string
  alert_type: boolean
  customer_id: string
  match: string
  match_description: string
  match_numeric: number
  type: string
  entity_type: string
  name: string
  database: string
  old_match: string
  category: string
  subcategory: string
  old_categories: string
  new_categories: string
  comments: string
  mapped_entity_details: string
}
