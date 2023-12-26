import {NextFunction, Request, Response} from 'express';
import {HttpStatusCode} from "src/enums";
import {default as ValidatorInterface} from 'interfaces/IValidator';
import UserExistsValidator from "../validators/userExistsValidator";
import LoginValidator from "../validators/loginValidator";
import ValidationErrorResponse from "../responses/validationErrorResponse";
import realTimeIndividualScreeningValidator from "src/validators/realtimeIndividualScreeningValidator";
import realTimeBusinessScreeningValidator from "src/validators/realtimeBusinessScreeningValidator";
import BatchFileValidator from 'src/validators/uploadFileValidator'

/**
 * @desc this function gets a validator entity and then validate the incoming request based on that entity.
 * @param validator
 */
const validateWith = (validator: ValidatorInterface) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationErrors = await validator.validate(req);
            (validationErrors.length)
                ? res.status(HttpStatusCode.BadRequest)
                    .send(new ValidationErrorResponse(validationErrors))
                : next();
        } catch (e) {
            next(e)
        }
    }
};

/**
 * here we are registering all the custom validators
 * so that they can be used as middleware in routes.
 */
export const validateUserExists = () => validateWith(UserExistsValidator);
export const validateLogin = () => validateWith(LoginValidator);
export const validateBatchFile = () => validateWith(BatchFileValidator);
export const validateRealTimeIndividualScreeningRequest = () => validateWith(realTimeIndividualScreeningValidator);
export const validateRealTimeBusinessScreeningRequest = () => validateWith(realTimeBusinessScreeningValidator);
