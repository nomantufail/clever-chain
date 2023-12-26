import { ErrorType, HttpStatusCode } from 'src/enums';
import ErrorResponse from './errorResponse';
export default class AuthenticationErrorResponse extends ErrorResponse {
  constructor(message: string) {
    super(message);
    this.status = HttpStatusCode.Unauthorized;
    this.error.message = message;
    this.error.type = ErrorType.Authentication;
  }
}
