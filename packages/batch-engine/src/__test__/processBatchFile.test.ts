import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { individualRawScreening } from "./mocks/entityRecord";
import bridgerService from "../../../shared/src/services/bridger.service";
import { processPendingJob } from "../app";
import dbService from "shared/services/db.service";

let mock = new MockAdapter(axios);

describe('test batch file', () => {
    beforeAll(() => {
        mock.onPost("https://staging.bridger.lexisnexis.eu/LN.WebServices/api/Token/Issue").reply(200, {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        });

        mock.onPost("https://staging.bridger.lexisnexis.eu/LN.WebServices/api/Lists/Search").reply(200, {
            Records: [
                individualRawScreening
            ],
        });
    })

    it('should successfully login to bridger', async () => {
        const resp = await bridgerService.bridgerLogin();
        expect(resp.length).not.toEqual(0)
    })

    it('should process batch file', async () => {
        const resp = await processPendingJob();
        expect(resp).not.toEqual(0);
        const query = `SELECT * FROM clever_chain.job_entity WHERE job_id=4981fc7e-a66c-4c81-8477-be27e56a8a3b ALLOW FILTERING;`;
        const jobResp = await dbService.executeQuery(query);
        expect(jobResp.rows.length).not.toEqual(0);
    })
})

