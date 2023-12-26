export interface IValidationError {
    field: string,
    message: string,
    value?: string,
    index?: number
}
