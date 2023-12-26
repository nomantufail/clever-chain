import { rest } from "msw";
import { setupServer } from "msw/node";
import jobEntitiesResponse from "src/tests/mocks/jobEntitiesResponse";
import matchFullReportResponse from "src/tests/mocks/matchFullReportResponse";
import jobsResponse from "src/tests/mocks/jobsResponse";
import realtimeBusinessScreeningResponse from "src/tests/mocks/realtimeBusinessScreeningResponse";
import realtimeIndividualScreeningResponse from "src/tests/mocks/realtimeIndividualScreeningResponse";

const apis = [
  // @ts-ignore
  rest.post("http://localhost:5000/api/v1/login", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: {
            "user": {
              "id": "test@gmail.com",
              "name": "test user",
              "email": "test@gmail.com",
              "password": "$2b$10$3npnRtBvao1gqaI459hal.LxDRfAIB/.PALLu/ITlvPmWA8aFEs2."
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RAZ21haWwuY29tIiwibmFtZSI6InRlc3QgdXNlciIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCQzbnBuUnRCdmFvMWdxYUk0NTloYWwuTHhEUmZBSUIvLlBBTEx1L0lUbHZQbVdBOGFGRXMyLiIsImlhdCI6MTY0ODYyNjk5MX0.RtXzWsE6T8OjeviDE2GWhCRvd3q9eTQQPpnSjj_wVu4"
          }
        }
      )
    );
  }),

// @ts-ignore
  rest.post("http://localhost:5000/api/v1/screen/batch", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: {
            "results": [
              {
                "constant_val": "constantVal",
                "started_at": "2022-06-13T09:02:23.308Z",
                "id": "18c1ae42-a3ac-4222-a420-66cf9b059bf5",
                "completed_time": "01:01:00",
                "created_at": null,
                "created_by": null,
                "customer_id": "8481791a-3349-47af-832b-68626ab644f9",
                "customer_type": "Individual",
                "deleted_at": null,
                "deleted_by": null,
                "error_message": null,
                "file_path": "1655110943295_sampleUser.csv",
                "is_deleted": null,
                "job_state": "file uploaded",
                "job_status": "Pending",
                "job_title": "sampleUser.csv",
                "matched_customers": 0,
                "no_matches": 0,
                "potential_matches": 0,
                "total_input_records": 0,
                "updated_at": null,
                "updated_by": null
              },
            ],
            "paging": {
              "nextPage": null,
              "totalPages": 1,
              "totalRecordsAvailable": 6
            }
          }
        }
      )
    );
  }),


  // @ts-ignore
  rest.get("http://localhost:5000/api/v1/jobs/1234", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: jobEntitiesResponse
        }
      )
    );
  }),

  // @ts-ignore
  rest.get("http://localhost:5000/api/v1/jobs", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: jobsResponse
        }
      )
    );
  }),
  // @ts-ignore
  rest.get("http://localhost:5000/api/v1/screen/business", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: realtimeBusinessScreeningResponse
        }
      )
    );
  }),
  // @ts-ignore
  rest.get("http://localhost:5000/api/v1/screen/individual", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: realtimeIndividualScreeningResponse
        }
      )
    );
  }),
  // @ts-ignore
  rest.get("http://localhost:5000/api/v1/reports/match/5678", (req, res, ctx) => {
    return res(
      ctx.json(
        {
          data: matchFullReportResponse
        }
      )
    );
  }),
];

const server = setupServer(...apis);
// @ts-ignore
export const loginApiReturning_403 = rest.post("http://localhost:5000/api/v1/login", (req, res, ctx) => {
  return res(ctx.status(403));
});

// @ts-ignore
export const jobEntitiesApiReturning_401 = rest.get("http://localhost:5000/api/v1/jobs/1234", (req, res, ctx) => {
  return res(ctx.status(401), ctx.json({ error: { message: "something went wrong" } }));
});

// @ts-ignore
export const matchFullReportApiReturning_500 = rest.get("api/v1/reports/match/1234", (req, res, ctx) => {
  return res(ctx.status(500), ctx.json({ error: { message: "something went wrong" } }));
});

// @ts-ignore
export const jobsApiReturning_401 = rest.get("http://localhost:5000/api/v1/jobs", (req, res, ctx) => {
  return res(ctx.status(401), ctx.json({ error: { message: "something went wrong" } }));
});

// @ts-ignore
export const batchScanningApiReturning_500 = rest.get("http://localhost:5000/api/v1/screen/batch", (req, res, ctx) => {
  return res(ctx.status(500), ctx.json({ error: { message: "something went wrong" } }));
})

// @ts-ignore
export const businessScanningApiReturning_500 = rest.get("http://localhost:5000/api/v1/screen/business", (req, res, ctx) => {
  return res(ctx.status(500), ctx.json({ error: { message: "something went wrong" } }));
});
// @ts-ignore
export const individualScanningApiReturning_500 = rest.get("http://localhost:5000/api/v1/screen/individual", (req, res, ctx) => {
  return res(ctx.status(500), ctx.json({ error: { message: "something went wrong" } }));
});
export default server;
