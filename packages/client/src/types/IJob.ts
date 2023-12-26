export default interface IJob {
    id: string
    job_title: string
    job_status: string
    job_state: string
    file_path: string
    error_message: string
    total_input_records: number
    customer_type: string
    matched_customers: number
    potential_matches: number
    no_matches: number
    completed_time: string
    started_at: string
    constant_val?: string
    created_at?: string
    updated_at?: string
    deleted_at?: string
    created_by?: string
    updated_by?: string
    deleted_by?: string
    is_deleted?: boolean
}
