import Validator from './validator';
import { Request } from 'express';
import { IValidationError } from 'interfaces/IValidationError';
import { default as ValidatorInterface } from 'interfaces/IValidator';

/**
 * this validator class is responsible to validate an incoming request GetUserByIdRequest
 */
class UserExistsValidator extends Validator implements ValidatorInterface {
  // @ts-ignore
  async validate(req: Request): Promise<IValidationError[]> {
    // const params = req.params as unknown as GetUserByIdRequest.Params;
    // @ts-ignore
    const errors: IValidationError[] = [{ field: 'userId', message: 'userId is incorrect' }];
    // const exists = await entityRepository.isUserExists(params.userId);
    // if (!exists) {
    //     errors.push( {field: 'userId', message: 'This User does not exists'})
    //     errors.push( {field: 'firstName', message: 'firstname required.'})
    // }
    return Promise.resolve([]);
  }
}
const userExistsValidator = new UserExistsValidator();
export default userExistsValidator;
