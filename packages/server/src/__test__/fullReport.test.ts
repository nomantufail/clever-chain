import server from "../app";
import commonService from "shared/services/common.service";
import { sampleReport } from "./mock/mockReport";
import dbService from "shared/services/db.service";

const request = require('supertest');

describe('Jobs test', () => {
    // @ts-ignore
    let token: string;
    const reportId = commonService.getUuidV4();

    beforeAll(async () => {
        const response = await request(server)
            .post('/api/v1/login')
            .send({
                username: "wshahzaib",
                password: "U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q="
            });

        token = `Bearer ${response.body.data.token}`;
        const query = ([{
            query:
                "INSERT INTO clever_chain.match_report (id,constant_val,full_report,created_at,updated_at) VALUES (?, ?, ?,?, ?)",
            params: [
                reportId,
                'constantVal',
                JSON.stringify(sampleReport),
                new Date(),
                new Date(),
            ]
        }]);
        await dbService.executeBatch(query);
    })

    describe('test full report', () => {
        describe('If auth token not provided', () => {
            it('should not get full report without passing auth token', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/reports/match/${reportId}`)
                        .set('Authorization', null)
                        .query({});
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.success).toEqual(false);
                    resolve('ok');
                });
            })
        })

        describe('If auth token provided but report id is invalid', () => {
            it('should not get report with invalid report id', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/reports/match/161fb3b9-9aff-4aa5-ba94-ed3fcb39008b`)
                        .set('Authorization', token)
                        .query({});
                    expect(res.statusCode).toEqual(400);
                    expect(res.body.success).toEqual(false);
                    resolve('ok');
                });
            })
        });

        describe('If auth token provided and valid report id is provided', () => {
            it('should return full report with valid report id', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/reports/match/${reportId}`)
                        .set('Authorization', token)
                        .query({});
                    expect(res.statusCode).toEqual(200);
                    expect(res.body).toHaveProperty('data');
                    expect(res.body.data).toHaveProperty('report');
                    expect(res.body.success).toEqual(true);
                    resolve('ok');
                });
            })
        });
    })
});

