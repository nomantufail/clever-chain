import { NextFunction, Request, Response } from "express";
import SuccessResponse from "src/responses/successResponse";
import { parse } from "csv-parse";
import jobsRepository from "src/repositories/jobsRepository";
import { ValidationErrorResponse } from "src/responses";

var fs = require('fs');

class BatchScreeningController {
  async startBatchScreening(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.file) {
        return response.send(new ValidationErrorResponse([{ field: 'file', message: 'File is missing' }]))
      }

      await jobsRepository.createJob(request.file.filename, request.file.originalname, request.body.customerType, response.locals.user.customer_id);

      var csvData: any = [];
      fs.createReadStream('src/uploads/sampleUser.csv')
        .pipe(parse({ delimiter: ':' }))
        .on('data', function (csvrow: any) {
          // console.log(csvrow);
          //do something with csvrow
          csvData.push(csvrow);
        })
        .on('end', function () {
          //do something with csvData
          const columnNames = csvData.shift(); // Separate first row with column names
          // @ts-ignore
          const objs = csvData.map((row: any) => {
            // Map the rest of the rows into objects
            const obj: any = {}; // Create object literal for current row
            row.forEach((cell: any, i: any) => {
              obj[columnNames[i]] = cell; // Use index from current cell to get column name, add current cell to new object
            });

            return obj;
          });
        });

      return response.send(new SuccessResponse('success'));
    } catch (e) {
      next(e);
    }
  }
}

const batchScreeningController = new BatchScreeningController();
export default batchScreeningController;
