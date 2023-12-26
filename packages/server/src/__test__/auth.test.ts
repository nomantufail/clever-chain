// @ts-ignore
import server from '../app';

const request = require('supertest');

describe('if user provided correct credentials, username & password', () => {
    let token: string;

    beforeAll(async () => {
        const response = await request(server)
            .post('/api/v1/login')
            .send({
                username: "ntufail",
                password: "U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q="
            });

        token = `Bearer ${response.body.data.token}`;
    })

    it('it should return 401 on login user with invalid username', () => {
        return new Promise(async (resolve) => {
            const res = await request(server).post('/api/v1/login').send({
                username: 'wshahzaib_1',
                password: 'U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q=',
            });
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.message).toEqual('Invalid credentials');
            resolve('ok');
        });
    });

    it('it should return 400 if username not provided', () => {
        return new Promise(async (resolve) => {
            const res = await request(server).post('/api/v1/login').send({
                password: 'U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q=',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error.message).toEqual('Invalid data');
            resolve('ok');
        });
    });

    it('should return 401 on login user with invalid password', () => {
        return new Promise(async (resolve) => {
            const res = await request(server).post('/api/v1/login').send({
                username: 'wshahzaib',
                password: 'U2FsdGVkX1',
            });
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.message).toEqual('Invalid credentials');
            resolve('ok');
        });
    });

    it('it should return 400 if password not provided', () => {
        return new Promise(async (resolve) => {
            const res = await request(server).post('/api/v1/login').send({
                username: 'wshahzaib',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error.message).toEqual('Invalid data');
            resolve('ok');
        });
    });

    describe('successful login if user provided correct credentials', () => {
        it('it should login user', () => {
            return new Promise(async (resolve) => {
                const res = await request(server).post('/api/v1/login').send({
                    username: 'ntufail',
                    password: 'U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q=',
                });
                expect(res.statusCode).toEqual(200);
                expect(res.body.success).toEqual(true);
                resolve('ok');
            });
        });
    });

    describe('Logout test cases', () => {
        it('it should not logout user if session does not exist', () => {
            return new Promise(async (resolve) => {
                const res = await request(server)
                    .get('/api/v1/logout')
                    .set('Authorization', '123')
                ;
                expect(res.statusCode).toEqual(401);
                expect(res.body.success).toEqual(false);
                resolve('ok');
            });
        });

        it('it should logout user', () => {
            return new Promise(async (resolve) => {
                const res = await request(server)
                    .get('/api/v1/logout')
                    .set('Authorization', token)
                ;
                expect(res.statusCode).toEqual(200);
                expect(res.body.success).toEqual(true);
                resolve('ok');
            });
        });
    });
});

