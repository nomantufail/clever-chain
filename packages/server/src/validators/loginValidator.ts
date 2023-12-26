import Validator from './validator';
import { Request } from 'express';
import { IValidationError } from 'interfaces/IValidationError';
import * as ILoginRequest from 'interfaces/requests/ILoginRequest';
import { default as ValidatorInterface } from 'interfaces/IValidator';

/**
 * this validator class is responsible to validate an incoming request LoginRequest
 */
class LoginValidator extends Validator implements ValidatorInterface {
  // @ts-ignore
  async validate(req: Request): Promise<IValidationError[]> {
    const body = req.body as unknown as ILoginRequest.Body;
    const requiredPayload = ['username', 'password'];
    const errors: IValidationError[] = [];
    // validation for required payload
    for (const prop of requiredPayload) {
      if (!body.hasOwnProperty(prop)) {
        errors.push({ field: prop, message: `${prop} is required.` });
      }
    }
    return Promise.resolve(errors);
  }
}
const loginValidator = new LoginValidator();
export default loginValidator;
