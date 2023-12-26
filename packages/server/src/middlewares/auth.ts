import { NextFunction, Request, Response } from 'express';
import authService from 'services/authService';
import { HttpStatusCode } from 'src/enums';
import {ErrorResponse} from "src/responses";

const auth = async (request: Request, res: Response, next: NextFunction) => {
  const { authorization } = request.headers;
  // const errors: IAuthenticationError[] = [];
  if (!authorization) {
    res
      .status(HttpStatusCode.Unauthorized)
      .send(new ErrorResponse('token not found'));
    return;
  }
  try {
    const token = authorization.split(' ')[1];
    const decodedToken: any = await authService.decodeAPiToken(token);
    res.locals.user = JSON.parse(JSON.parse(decodedToken));
    if (!decodedToken) {
      res
        .status(HttpStatusCode.Unauthorized)
        .send(new ErrorResponse('Invalid token'));
    } else {
      next();
    }
  } catch (e) {
    res.status(HttpStatusCode.Unauthorized).send(new ErrorResponse('Invalid token'));
  }
};

export default auth;
