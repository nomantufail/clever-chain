import {Request} from 'express';
import {IValidationError} from "./IValidationError";
export default interface IValidator {
    validate: (req: Request) => Promise<IValidationError[]>
}
