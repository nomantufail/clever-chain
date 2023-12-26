import { ErrorType, HttpStatusCode } from 'src/enums';
import ErrorResponse from './errorResponse';
export default class BadReqErrorResponse extends ErrorResponse {
  constructor(message: string) {
    super(message);
    this.status = HttpStatusCode.BadRequest;
    this.error.message = message;
    this.error.type = ErrorType.NotFound;
  }
}
