import Validator from './validator';
import {Request} from 'express';
import {IValidationError} from 'interfaces/IValidationError';
import {default as ValidatorInterface} from 'interfaces/IValidator';
import * as IBatchRequest from 'interfaces/requests/IBatchRequest';
import fs from "fs";
import {EntityType, Gender} from "src/enums";
import readline from "readline";

/**
 * this validator class is responsible to validate an uploaded batch file
 */
class BatchFileValidator extends Validator implements ValidatorInterface {
    async validate(req: Request): Promise<IValidationError[]> {
        let csvData: any = [];
        let fileData: any = [];
        return new Promise((resolve) => {
            const body = req.body as unknown as IBatchRequest.Body;
            if (req && req.file) {
                const readLine = readline.createInterface({
                    input: fs.createReadStream(`./../batch-engine/uploads/${req.file.filename}`, 'utf8'),
                    crlfDelay: Infinity
                });
                readLine.on("line", (csvrow: any) => {
                    fileData.push(csvrow + ',');
                    csvrow = this.CSVtoArray(csvrow.toString().split("'").join("~~"));
                    csvData.push(csvrow.map((str: string) => str.split("~~").join("'")));
                })
                    .on("close", async () => {
                        //do something with csvData
                        let headings = csvData.shift();
                        const entities = csvData.map((item: any) => {
                            // Map the rest of the rows into objects
                            const obj: any = {}; // Create object literal for current row
                            item.forEach((cell: any, i: any) => {
                                obj[headings[i]] = cell; // Use index from current cell to get column
                            });
                            return obj;
                        });
                        let errors: IValidationError[] = [];
                        if (body.customerType.toLowerCase() === EntityType.Individual.toLowerCase()) {
                            // validate individuals
                            const requiredPayload = ['First Name', 'Last Name'];
                            for (let i = 0; i < entities.length; i++) {
                                // validate required properties
                                for (const prop of requiredPayload) {
                                    if (!entities[i].hasOwnProperty(prop) || !entities[i][prop]) {
                                        errors.push({
                                            field: prop,
                                            message: `${prop} is required`,
                                            index: i + 1
                                        });
                                    }
                                }
                                // validate gender
                                if (entities[i].hasOwnProperty('Gender') && entities[i]['Gender'] !== '') {
                                    if (entities[i]['Gender'].toLowerCase() !== Gender.Male.toLowerCase() && entities[i]['Gender'].toLowerCase() !== Gender.Female.toLowerCase()) {
                                        errors.push({
                                            field: 'Gender',
                                            message: `Gender is invalid`,
                                            index: i + 1
                                        });
                                    }
                                }
                                // validate dob
                                if (entities[i].hasOwnProperty('Date of Birth') && entities[i]['Date of Birth'] !== '') {
                                    if (!this.isValidDate(entities[i]['Date of Birth'])) {
                                        errors.push({
                                            field: 'DOB',
                                            message: `DOB is invalid`,
                                            index: i + 1
                                        });
                                    }
                                }
                            }
                        } else {
                            // validate business
                            const requiredPayload = ['Registered name'];
                            // validation for required payload
                            for (let i = 0; i < entities.length; i++) {
                                for (const prop of requiredPayload) {
                                    if (!entities[i].hasOwnProperty(prop) || !entities[i][prop]) {
                                        errors.push({
                                            field: prop,
                                            message: `${prop} is required`,
                                            index: i + 1
                                        });
                                    }
                                }
                            }
                        }

                        const writeStream = fs.createWriteStream(`./../batch-engine/uploads/${req?.file?.filename}`, {encoding: "utf8"})
                        fileData = fileData.map((item: any, itemIndex: number) => {
                            if (itemIndex === 0) {
                                item = item + 'Errors'
                            }
                            errors.map((error) => {
                                if (itemIndex === error.index) {
                                    item = item + '| ' + error.message
                                }
                            })
                            return item;
                        })
                        for (const rec of fileData) {
                            writeStream.write(rec + '\n');
                        }

                        if(errors.length) {
                            errors = [
                                {
                                    field: '',
                                    message: `Data validation issues occurred, Please check the downloaded file.`,
                                    value: `${req?.file?.filename}`
                                }
                            ]
                        }

                        return resolve(errors);
                    });
            }
        })
    }

    setFormatDDMMYYYYtoMMDDYYYY = (date: string, separator = '/') => {
        const [day, month, year] = date.split(separator);
        return month + separator + day + separator + year;
    };

    isValidDate(dateObject: any) {
        if((dateObject.length && dateObject.length > 4)) {
            let separator: string;
            if(dateObject.indexOf('/') > -1) {
                separator = '/';
            } else {
                separator = '-';
            }
            dateObject = this.setFormatDDMMYYYYtoMMDDYYYY(dateObject, separator);
        }
        return new Date(dateObject).toString() !== 'Invalid Date';
    }

    CSVtoArray(text: any) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            // @ts-ignore
            function (m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, "\""));
                else if (m3 !== undefined) a.push(m3);
                return ""; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push("");
        return a;
    };
}

const batchFileValidator = new BatchFileValidator();
export default batchFileValidator;
