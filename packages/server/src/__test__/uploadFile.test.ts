import server from '../app';
import path from "path";

const request = require('supertest');

describe('upload file', () => {
    let token1: string;
    beforeAll(async () => {
        jest.mock('multer', () => {
            const multer = () => ({
                any: () => {
                    // @ts-ignore
                    return (req: any, res: any, next: any) => {
                        req.body = {}
                        req.files = [
                            {
                                originalname: 'sample.name',
                                mimetype: 'text/csv',
                                path: '../../uploads/sampleUser.csv',
                                buffer: Buffer.from('whatever'),
                            },
                        ]
                        return next()
                    }
                },
            })
            multer.memoryStorage = () => jest.fn()
            return multer
        })

        const response = await request(server)
            .post('/api/v1/login')
            .send({
                username: "ntufail",
                password: "U2FsdGVkX1/rI2QbcQUMhPw1ZAD9axRtE5BozzStl4Q="
            });

        token1 = `Bearer ${response.body.data.token}`;
    })

    it('should not upload file without auth token', () => {
        return new Promise(async (resolve) => {
            const res = await request(server)
                .post('/api/v1/screen/batch')
                .send({
                    file: [],
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toEqual(false);
            resolve('ok');
        });
    });

    it('should upload file', () => {
        const csvDoc = path.resolve(__dirname, `./mock/sampleUser.csv`);
        return new Promise(async (resolve) => {
            const res = await request(server)
                .post('/api/v1/screen/batch')
                .set('Authorization', token1)
                .field('customerType', 'Individual')
                .attach('file', csvDoc)
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toEqual(true);
            resolve('ok');
        });
    });
});
