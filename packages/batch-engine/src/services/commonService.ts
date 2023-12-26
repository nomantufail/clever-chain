// import moment from 'moment';
import * as readline from "readline";

const moment = require("moment");
var fs = require("fs");
import { v4 as uuidv4 } from "uuid";
import { DateFormat } from "../../src/enums";

class CommonService {
  constructor() {
  }

  async now() {
    return moment().utcOffset(0, true).format();
  }

  _getAllAddresses(match: any) {
    const addresses: any[] = [];
    match["EntityDetails"] && Array.isArray(match["EntityDetails"]["Addresses"]) && addresses.push(...match["EntityDetails"]["Addresses"]);
    match["MatchXML"] && Array.isArray(match["MatchXML"]["AddressMatches"]) && addresses.push(...match["MatchXML"]["AddressMatches"].map((addr: any) => {
      addr["ListValue"] = addr["List"];
      return addr;
    }));
    Array.isArray(match["Addresses"]) && addresses.push(...match["Addresses"]);
    return addresses;
  }

  formatDate(date: string, from: string, to: string) {
    return moment(date, from).format(to);
  }

  getYear(date: string, format: string) {
    return moment(date, format).format('YYYY');
  }

  getMonth(date: string, format: string) {
    const tempDate = date.split('-');
    if(date === '' || tempDate.length < 3) {
      return 'Invalid date'
    }
    return moment(date, format).format('MM');
  }

  getDay(date: string, format: string) {
    if(format === DateFormat.Output) {
      format = DateFormat.Input;
      date = date.split('-').reverse().join('-');
    }
    return moment(date, format).format('DD');
  }

  isValidDate(date: string, format: string) {
    const dateObject = moment(date, format);
    return dateObject.isValid();
  }

  getUuidV4() {
    return uuidv4();
  }

  getBridgerHeaders(accessToken: string) {
    return {
      "Content-Type": "application/json",
      "X-API-Key": `1d10af30-376a-494f-8340-09a8ef3c303e`,
      Authorization: `Bearer ${accessToken}`
    };
  }

  getNamePart(name: string, namePart: string) {
    // remove comma from name string
    name = name.replace(/,/g, '');
    const nameArr = name.split(" ");
    switch (namePart) {
      case "first":
        return nameArr && nameArr.length === 2
          ? nameArr[1]
          : nameArr && nameArr.length === 3
            ? nameArr[2]
            : "";
      case "middle":
        return nameArr && nameArr.length > 2 ? nameArr[1] : "";
      case "last":
        return nameArr && nameArr.length > 0 ? nameArr[0] : "";
      default:
        return "";
    }
  }

  CSVtoArray(text: any) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
      // @ts-ignore
      function(m0, m1, m2, m3) {
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

  /**
   * read csv file data and transform
   * it to javascript array of objects
   */
  readFileData(filePath: string) {
    var csvData: any = [];
    return new Promise((resolve, reject) => {
      const readLine = readline.createInterface({
        input: fs.createReadStream(filePath, 'utf8'),
        crlfDelay: Infinity
      });
      readLine.on("line", (csvrow: any) => {
        //do something with csvrow
        csvrow = this.CSVtoArray(csvrow.toString().split("'").join("~~"));
        csvData.push(csvrow.map((str: string) => str.split("~~").join("'")));
      })
        .on("close", async () => {
          //do something with csvData
          let headings = csvData.shift();
          try {
            const users = csvData.map((item: any) => {
              // Map the rest of the rows into objects
              const obj: any = {}; // Create object literal for current row
              item.forEach((cell: any, i: any) => {
                obj[headings[i]] = cell; // Use index from current cell to get column
              });
              return obj;
            });
            // console.log('users', users);
            return resolve(users);
          } catch (e) {
            return reject(e);
          } finally {
          }
        });
    });
  }

  getIndividualScreeningPayload(entities: any) {
    return new Promise((resolve: any) => {
      const screeningPayload = {
        SearchConfiguration: {
          AssignResultTo: {
            Division: "Default division",
            RolesOrUsers: ["Administrator"],
            Type: "Role"
          },
          PredefinedSearchName: "CS_Full"
        },
        SearchInput: {
          BlockID: "string",
          Records: entities.map((entity: any) => {
            const input = {
              Entity: {
                EntityType: "Individual",
                Name: {
                  Title: entity["Title"],
                  First: entity["First Name"],
                  Middle: entity["Middle Name"],
                  Last: entity["Last Name"]
                },
                Addresses: [
                  {
                    City: entity["City - Current"],
                    Country: entity["Country - Current"],
                    StateProvinceDistrict: entity["State - Current"],
                    PostalCode: entity["Postal Code - Current"],
                    Street1: entity["Address Line 1 - Current"] && this.decodeTildaSeparatedVals(entity["Address Line 1 - Current"]),
                    Street2: entity["Address Line 2 - Current"] && this.decodeTildaSeparatedVals(entity["Address Line 2 - Current"]),
                    Type: "Current"
                  },
                  {
                    City: entity["City - Previous"],
                    Country: entity["Country - Previous"],
                    StateProvinceDistrict: entity["State - Previous"],
                    PostalCode: entity["Postal Code - Previous"],
                    Street1: entity["Address Line 1 - Previous"] && this.decodeTildaSeparatedVals(entity["Address Line 1 - Previous"]),
                    Street2: entity["Address Line 2 - Previous"] && this.decodeTildaSeparatedVals(entity["Address Line 2 - Previous"]),
                    Type: "Previous"
                  }
                ],
                AdditionalInfo: [
                  {
                    Type: "DOB",
                    Value: entity["Date of Birth"]
                  },
                  {
                    Type: "Nationality",
                    Value: entity["Nationality"]
                  },
                  {
                    Type: "PlaceOfBirth",
                    Value: entity["Place of Birth"] && this.decodeTildaSeparatedVals(entity["Place of Birth"])
                  },
                  {
                    Type: "Occupation",
                    Value: entity["Occupation"]
                  },
                  {
                    Type: "Other",
                    Value: entity["id"]
                  }
                ],
                IDs: [
                  {
                    Type: "Other",
                    Number: entity['Other Information']
                  }
                ],
                Gender: entity["Gender"]
              }
            };
            if (!input["Entity"]["Gender"]) {
              delete input["Entity"]["Gender"];
            }
            return input;
          })
        }
      };
      return resolve(screeningPayload);
    });
  }

  getBusinessScreeningPayload(entities: any) {
    return new Promise((resolve: any) => {
      const screeningPayload = {
        SearchConfiguration: {
          AssignResultTo: {
            Division: "Default division",
            RolesOrUsers: ["Administrator"],
            Type: "Role"
          },
          PredefinedSearchName: "CS_Full"
        },
        SearchInput: {
          BlockID: "string",
          Records: entities.map((entity: any) => {
            return {
              Entity: {
                EntityType: "Business",
                Name: {
                  Full: entity["Registered name"]
                },
                Addresses: [
                  {
                    City: entity["City - Current"],
                    Country: entity["Country - Current"],
                    StateProvinceDistrict: entity["State - Current"],
                    PostalCode: entity["Postal Code - Current"],
                    Street1: entity["Address Line 1 - Current"],
                    Street2: entity["Address Line 2 - Current"],
                    Type: "Current"
                  }
                ],
                AdditionalInfo: [
                  {
                    Type: "Other",
                    Value: entity["id"]
                  }
                ],
                IDs: [
                  {
                    Type: "EIN",
                    Number: entity['EIN']
                  },
                  {
                    Type: "SwiftBIC",
                    Number: entity['SWIFT BIC']
                  },
                  {
                    Type: "BusinessRegistrationNumber",
                    Number: entity['Business Registration Number']
                  },
                ]
              }
            };
          })
        }
      };
      return resolve(screeningPayload);
    });
  }

  splitArrayIntoChunks = <T>(arr: T[], size: number): T[][] =>
    [...Array(Math.ceil(arr.length / size))].map((_, i) => arr.slice(size * i, size + size * i));

  decodeTildaSeparatedVals(input: string) {
    return input.replace(/~/g, ",");
  }
}

const commonService = new CommonService();
export default commonService;
