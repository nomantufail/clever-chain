// @ts-nocheck
import express, {Router} from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import * as validator from '../middlewares/customValidators';
import upload from "src/utils/fileUploadUtility";
import batchScreeningController from "src/controllers/batchScreeningController";
import authMiddleware from "src/middlewares/auth";
import realTimeScreeningController from "src/controllers/realTimeScreeningController";
import filtersController from "src/controllers/filtersController";
import jobsController from "src/controllers/jobsController";
import reportsController from "../controllers/reportsController";
import alertsController from "src/controllers/alertsController";

export const appRouter: Router = express.Router({mergeParams: true});

;
/**
 * ----------Auth routes
 */
appRouter.post('/login', [validator.validateLogin()], authController.login);
appRouter.get('/logout', [], authController.logout);

// @ts-ignore todo: remove this once done with CI/CD
appRouter.get('/foo', [], (req, res) => {
    res.send('bar');
});
/**
 * ----------User routes
 */
appRouter.get(
    '/user/:userId',
    [validator.validateUserExists()],
    userController.getUserById,
);

/**
 * Batch screening routes
 */
appRouter.post(
    '/screen/batch',
    [
      // authMiddleware,
        upload.single('file'),
        validator.validateBatchFile()
    ], //todo: add auth middleware + validation
    batchScreeningController.startBatchScreening,
);
appRouter.get(
  '/jobs',
  // [authMiddleware],
  jobsController.fetchJobs,
);
appRouter.get(
  '/jobs/:id',
  // [authMiddleware],
  jobsController.fetchJobEntities,
);
appRouter.get(
  '/jobs/:jobId/matches/:entityId',
  // [authMiddleware],
  jobsController.fetchJobMatches,
);

/**
 * Real time screening routes
 */
appRouter.get(
    '/screen/individual',
    // [authMiddleware, validator.validateRealTimeIndividualScreeningRequest()],
    realTimeScreeningController.getIndividualScreeningResults,
);
appRouter.get(
    '/screen/business',
    // [authMiddleware, validator.validateRealTimeBusinessScreeningRequest()],
    realTimeScreeningController.getBusinessScreeningResults,
);
appRouter.get(
    '/filters',
    // [authMiddleware],
    filtersController.getAllFilters,
);

appRouter.get(
    '/export/csv',
    realTimeScreeningController.exportCSVFullReport,
);

/**
 * Reports routes
 */
appRouter.get(
  '/reports/match/:matchId',
  // [authMiddleware],
  reportsController.getMatchReport,
);

appRouter.get(
    '/alerts',
    // [authMiddleware],
    alertsController.getAlerts,
);
