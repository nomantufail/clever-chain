import Validator from './validator';
import {Request} from 'express';
import {IValidationError} from 'interfaces/IValidationError';
import * as IndividualScreeningRequest from 'interfaces/requests/individualScreeningRequest';
import {default as ValidatorInterface} from 'interfaces/IValidator';

/**
 * this validator class is responsible to validate an incoming request LoginRequest
 */
class RealTimeIndividualScreeningValidator extends Validator implements ValidatorInterface {
    // @ts-ignore
    async validate(req: Request): Promise<IValidationError[]> {
        const params = req.query as unknown as IndividualScreeningRequest.Params;
        const errors: IValidationError[] = [];
        if (!params.firstName) {
            errors.push({field: 'firstName', message: `firstName is required.`});
        }
        if (!params.lastName) {
            errors.push({field: 'lastName', message: `lastName is required.`});
        }
        return Promise.resolve(errors);
    }
}

const realTimeIndividualScreeningValidator = new RealTimeIndividualScreeningValidator();
export default realTimeIndividualScreeningValidator;
