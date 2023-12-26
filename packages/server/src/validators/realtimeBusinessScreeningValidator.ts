import Validator from './validator';
import {Request} from 'express';
import {IValidationError} from 'interfaces/IValidationError';
import * as BusinessScreeningRequest from 'interfaces/requests/businessScreeningRequest';
import {default as ValidatorInterface} from 'interfaces/IValidator';

/**
 * this validator class is responsible to validate an incoming request LoginRequest
 */
class RealTimeBusinessScreeningValidator extends Validator implements ValidatorInterface {
    // @ts-ignore
    async validate(req: Request): Promise<IValidationError[]> {
        const params = req.query as unknown as BusinessScreeningRequest.Params;
        const errors: IValidationError[] = [];
        if (!params.name) {
            errors.push({field: 'name', message: `firstName is required.`});
        }
        return Promise.resolve(errors);
    }
}

const realTimeBusinessScreeningValidator = new RealTimeBusinessScreeningValidator();
export default realTimeBusinessScreeningValidator;
