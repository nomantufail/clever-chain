import Response from 'src/responses/response'
import {HttpStatusCode} from "src/enums";
import ISuccessResponse from "interfaces/ISuccessResponse";
export default class SuccessResponse<Type> extends Response implements ISuccessResponse{
    public data: Type;
    constructor(data: Type) {
        super();
        this.status = HttpStatusCode.Ok;
        this.success = true;
        this.data = data;
    }
}
