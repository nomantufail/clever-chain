import {NextFunction, Request, Response} from "express";
import * as GetUserByIdRequest from "interfaces/requests/getUserByIdRequest";
import userRepository, {UserRepository} from "src/repositories/userRepository";
import SuccessResponse from "src/responses/successResponse";
import IUser from "shared/server/types/response/IUser";

const userRepo: UserRepository = userRepository;
class UserController {
    async getUserById(request: Request, response: Response, next: NextFunction)  {
        try {
            const params = request.params as unknown as GetUserByIdRequest.Params;
            const user: IUser = await userRepo.getUserById(params.userId);
            response.send(new SuccessResponse<IUser>(user));
        }
        catch (e) {
            next(e);
        }
    }

}

const userController = new UserController();
export default userController;
