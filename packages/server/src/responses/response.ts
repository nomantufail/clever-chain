import {HttpStatusCode} from "src/enums";

export default abstract class Response {
    constructor() {}
    public status: number = HttpStatusCode.Ok;
    public success: boolean = true;
}
