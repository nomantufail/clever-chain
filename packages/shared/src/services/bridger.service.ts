import commonService from "./common.service";

const axios = require("axios");

class BridgerService {
  constructor() {
  }

  async bridgerLogin() {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Basic Q2xldkNoYWluR0JUZXN0L0FRYXl5dW0wMTpCcmlkZ2VyNDMyMSE="
      };
      const response = await axios.post(
        `https://staging.bridger.lexisnexis.eu/LN.WebServices/api/Token/Issue`,
        {},
        {
          headers
        }
      );
      return response.data.access_token;
    } catch (e) {
      console.log(e);
    }
  }

  async bridgerSearch(token: string, searchData: any): Promise<any> {
    return new Promise(async (resolve: any, reject) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "X-API-Key": `1d10af30-376a-494f-8340-09a8ef3c303e`,
          Authorization: `Bearer ${token}`
        };
        const response = await axios.post(
          `https://staging.bridger.lexisnexis.eu/LN.WebServices/api/Lists/Search`,
          searchData,
          {
            headers
          }
        ).catch(() => {
          reject({ message: `Something went wrong. Please check with administrator.` });
        });
        resolve(response.data);
      } catch (e) {
        console.log(e);
      }
    });
  }

  combinePayloads(payloads: any[]) {
    return {
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
        Records: payloads
      }
    };
  }

  getIndividualScreeningPayload(entity: any) {
    const payload = {
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
            Street1: entity["Address Line 1 - Current"] && commonService.decodeTildaSeparatedVals(entity["Address Line 1 - Current"]),
            Street2: entity["Address Line 2 - Current"] && commonService.decodeTildaSeparatedVals(entity["Address Line 2 - Current"]),
            Type: "Current"
          },
          {
            City: entity["City - Previous"],
            Country: entity["Country - Previous"],
            StateProvinceDistrict: entity["State - Previous"],
            PostalCode: entity["Postal Code - Previous"],
            Street1: entity["Address Line 1 - Previous"] && commonService.decodeTildaSeparatedVals(entity["Address Line 1 - Previous"]),
            Street2: entity["Address Line 2 - Previous"] && commonService.decodeTildaSeparatedVals(entity["Address Line 2 - Previous"]),
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
            Value: entity["Place of Birth"] && commonService.decodeTildaSeparatedVals(entity["Place of Birth"])
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
            Number: entity["Other Information"] || ""
          }
        ],
        Gender: entity["Gender"]
      }
    };
    if (!payload["Entity"]["Gender"]) {
      delete payload["Entity"]["Gender"];
    }
    return payload;
  }

  getBusinessScreeningPayload(entity: any) {
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
            Number: entity["EIN"]
          },
          {
            Type: "SwiftBIC",
            Number: entity["SWIFT BIC"]
          },
          {
            Type: "BusinessRegistrationNumber",
            Number: entity["Business Registration Number"]
          }
        ]
      }
    };
  }
}

const bridgerService = new BridgerService();
export default bridgerService;
