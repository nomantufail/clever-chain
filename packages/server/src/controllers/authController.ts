// @ts-nocheck
import {NextFunction, Request, Response} from 'express';
import authService from 'services/authService';
import * as ILoginRequest from 'interfaces/requests/ILoginRequest';
import userRepository, {UserRepository} from '../repositories/userRepository';
import SuccessResponse from '../responses/successResponse';
import ILoginResponse from 'shared/server/types/response/ILoginResponse';
import {HttpStatusCode} from 'src/enums';
import AuthenticationErrorResponse from 'src/responses/authenticationErrorResponse';
import IUser from 'shared/server/types/response/IUser';
import * as CryptoJS from "crypto-js";

const userRepo: UserRepository = userRepository;

class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const body = (request.body as unknown as ILoginRequest.Body);
      // todo: remove static secret once env is deployed
      body.password = CryptoJS.AES.decrypt(body.password, process.env.ENCRYPTION_SECRET! || 'secret123').toString(CryptoJS.enc.Utf8)
      // const user: IUser = await userRepo.getUserByEmail(body.username);
      const user: IUser = {
        constant_val: "constantVal",
        username: "ntufail",
        id: "a41b560d-3e6e-469c-983d-8ac8de3f231a",
        created_at: null,
        created_by: null,
        customer_id: "8481791a-3349-47af-832b-68626ab644f9",
        customer_name: null,
        deleted_at: null,
        deleted_by: null,
        enabled: null,
        first_name: "noman",
        is_deleted: null,
        last_name: "tufail",
        password: "$2b$10$bo7gnN.NpGtXipMBL9CaAO4NDK/v8hiDkDGYpqKaATSOvCFDLytmi",
        role_name: "admin",
        updated_at: null,
        updated_by: null
      };
      // console.log(JSON.stringify(user));
      if (!user) {
        response
          .status(HttpStatusCode.Unauthorized)
          .send(new AuthenticationErrorResponse('Invalid credentials'));
        return;
      }
      // validating user credentials
      const isPasswordMatched: boolean = await authService.comparePassword(
        body.password,
        user.password,
      );

      if (body.username === user.username && isPasswordMatched) {
        const token = await authService.createToken(JSON.stringify(user));
        response.send(new SuccessResponse<ILoginResponse>({ user, token }));
      } else {
        response
          .status(HttpStatusCode.Unauthorized)
          .send(new AuthenticationErrorResponse('Invalid credentials'));
      }
    } catch (e) {
      next(e);
    }
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    try {
      const token: string = request.headers['authorization']?.slice(7) ?? '';
      const isTokenRemoved: number = await authService.removeToken(token);
      if (isTokenRemoved) {
        response.send(new SuccessResponse<{ message: string }>({ message: 'OK' }));
      } else {
        response
          .status(HttpStatusCode.Unauthorized)
          .send(new AuthenticationErrorResponse('User session not found'));
      }
    } catch (e) {
      next(e);
    }
  }
}

const authController = new AuthController();
export default authController;
