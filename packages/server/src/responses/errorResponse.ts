import Response from "./response";
import {ErrorType, HttpStatusCode} from "src/enums";
import {IValidationError} from "interfaces/IValidationError";

export type ErrorBody = {
    message: string,
    type: ErrorType,
    errorMessages: IValidationError[] | null
}

export default class ErrorResponse extends Response {
    public error: ErrorBody;
    constructor(message: string, status?: HttpStatusCode) {
        super();
        this.status = !status ? HttpStatusCode.InternalServerError: status;
        this.success = false;
        this.error = {
            message: message || 'something went wrong',
            type: ErrorType.InternalServerError,
            errorMessages: []
        }
    }
}
