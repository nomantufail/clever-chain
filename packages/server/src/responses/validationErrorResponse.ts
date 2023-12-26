import {ErrorType, HttpStatusCode} from "src/enums";
import {IValidationError} from "interfaces/IValidationError";
import ErrorResponse from "./errorResponse";
export default class ValidationErrorResponse extends ErrorResponse {
    constructor(errors: IValidationError[]) {
        super('Invalid data');
        this.status = HttpStatusCode.BadRequest;
        this.error.errorMessages = errors;
        this.error.type = ErrorType.ValidationError
    }
}
