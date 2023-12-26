// @ts-ignore
import express, { Application, Request, Response, NextFunction, Router } from 'express';
import { appRouter } from './appRouter';

export function registerAppRoutes(app: Application): Application {
    app.use('/api/v1', appRouter);
    return app;
}
