import server from '../app';

const request = require('supertest');

describe('Jobs test', () => {
    let token: string;
    let jobId: any;
    let jobEntityId: any;

    beforeAll(async () => {
        const response = await request(server)
            .post('/api/v1/login')
            .send({
                username: "ntufail",
                password: "U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q="
            });

        token = `Bearer ${response.body.data.token}`;

        const jobs = await request(server)
            .get('/api/v1/jobs')
            .set('Authorization', token)
        jobId = jobs.body.data.results[0].id;

        const jobEntities = await request(server)
            .get(`/api/v1/jobs/${jobId}`)
            .set('Authorization', token)
        jobEntityId = jobEntities.body.data.results[0].id;

        // const jobId = '5c54faaa-1e34-4bc0-ba5b-8d41291dd6ae';
        // const jobEntityId = '2a09c63e-19b5-4cd2-9798-c9689afcd677';
    })

    describe('test jobs', () => {
        describe('If auth token not provided', () => {
            it('should not get jobs without passing auth token', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get('/api/v1/jobs')
                        .set('Authorization', null)
                        .query({});
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.success).toEqual(false);
                    resolve('ok');
                });
            })
        })

        describe('If auth token provided', () => {
            it('should return all jobs with paging data', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get('/api/v1/jobs')
                        .set('Authorization', token)
                        .query({});
                    expect(res.statusCode).toEqual(200);
                    expect(res.body).toHaveProperty('data');
                    expect(res.body.data).toHaveProperty('results');
                    expect(res.body.data).toHaveProperty('paging');
                    expect(res.body.success).toEqual(true);
                    resolve('ok');
                });
            })
        });
    })


    // ******************  job entities test *********************
    describe('test job entities', () => {
        describe('If auth token not provided', () => {
            it('should not get job entities without passing auth token', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/jobs/${jobId}`)
                        .set('Authorization', null)
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.success).toEqual(false);
                    resolve('ok');
                });
            })
        })

        describe('If auth token provided', () => {
            it('should return all job entities with paging data', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/jobs/${jobId}`)
                        .set('Authorization', token)
                        .query({});
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.success).toEqual(true);
                    expect(res.body).toHaveProperty('data');
                    expect(res.body.data).toHaveProperty('results');
                    expect(res.body.data).toHaveProperty('paging');
                    resolve('ok');
                });
            })

            describe('if job id not provided', () => {
                it('should not get job entities without job id', () => {
                    return new Promise(async (resolve) => {
                        const res = await request(server)
                            .get(`/api/v1/jobs/null`)
                            .set('Authorization', token)
                            .query({});
                        expect(res.statusCode).toEqual(500);
                        expect(res.body.success).toEqual(false);
                        expect(res.body).toHaveProperty('error');
                        resolve('ok');
                    });

                })
            })
        })
    })


    // ******************  job results test *********************
    describe('test job results', () => {
        describe('If auth token not provided', () => {
            it('should not get job results without passing auth token', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/jobs/${jobId}/matches/${jobEntityId}`)
                        .set('Authorization', null)
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.success).toEqual(false);
                    resolve('ok');
                });
            })
        })

        describe('If auth token provided', () => {
            it('should return all job results with paging data', () => {
                return new Promise(async (resolve) => {
                    const res = await request(server)
                        .get(`/api/v1/jobs/${jobId}/matches/${jobEntityId}`)
                        .set('Authorization', token)
                        .query({});
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.success).toEqual(true);
                    expect(res.body).toHaveProperty('data');
                    expect(res.body.data).toHaveProperty('results');
                    expect(res.body.data).toHaveProperty('paging');
                    resolve('ok');
                });
            })
            describe('if job id not provided', () => {
                it('should not get job results without job id', () => {
                    return new Promise(async (resolve) => {
                        const res = await request(server)
                            .get(`/api/v1/jobs/null/matches/null`)
                            .set('Authorization', token)
                            .query({});
                        expect(res.statusCode).toEqual(500);
                        expect(res.body.success).toEqual(false);
                        expect(res.body).toHaveProperty('error');
                        resolve('ok');
                    });
                })
            })
        })
    })

});

