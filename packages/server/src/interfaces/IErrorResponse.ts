import { ErrorType } from "src/enums";
import { IValidationError } from "./IValidationError";

export interface ErrorBody {
    message: string,
    type: ErrorType,
    errorMessages: IValidationError[] | null
}

export interface IErrorResponse {
    success: boolean,
    status: number,
    error: ErrorBody
}
