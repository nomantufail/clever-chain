// @ts-nocheck
import authService from "services/authService";

require('module-alias/register')
import {getDbClient} from "shared/db/connector";
import express, {Application, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import {registerAppRoutes} from "./routes/baseRouter";
import {HttpStatusCode} from "./enums";
import {ErrorResponse, ValidationErrorResponse} from "src/responses/index";
import logger from "./logger";
import path from 'path';

let app: Application = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.use('/api/v1', express.static(path.join(__dirname, '..', '..', 'batch-engine', 'uploads')))
app = registerAppRoutes(app);

export const handleErrors = (res: Response, err: any) => {
    if (err instanceof multer.MulterError) {
        res.status(HttpStatusCode.BadRequest)
            .send(new ErrorResponse(err.message));
    }
    if (err.name === 'ValidationError') {
        res.status(HttpStatusCode.BadRequest)
            .send(new ValidationErrorResponse(err.errors));
    } else {
        console.log(err);
        res.status(HttpStatusCode.InternalServerError)
            .send(new ErrorResponse(err.message));
    }
}

//@ts-ignore
app.use((err: any, req: Request, res: Response, next: NextFunction) => handleErrors(res, err));

process.on('uncaughtException', () => {
    // todo: we can catch unhandled exceptions here.
});

const port = 3001;

(async () => {
    // await authService.initializeRedis();
    // const client = await getDbClient();
    // client.connect(function (error: any) {
    //     if (error != null) {
    //         logger.error(error);
    //         console.log(error);
    //     } else {
    //         console.log('connected to database', process.env.NODE_ENV)
            if (process.env.NODE_ENV !== 'test') {
                console.log('kdjfkjdkfjdkjfkdj', port);
                app.listen(
                    process.env.PORT || port,
                    () => console.log(`app ready: ${process.env.PORT || port}`)
                );
            }
    //     }
    // });
})();
export default app;
