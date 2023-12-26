import server from '../app';
const request = require('supertest');

describe('Realtime Individual screening', () => {
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

  describe('If invalid data was provided', () => {
    it('should return a 400 if lastname is not provided', () => {
      return new Promise(async (resolve) => {
        const res = await request(server)
          .get('/api/v1/screen/individual')
          .set('Authorization', token)
          .query({
            firstName: 'jack'
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toEqual(false);
        resolve('ok');
      });

    })

    it('should return a 400 if firstname is not provided', () => {
      return new Promise(async (resolve) => {
        const res = await request(server)
            .get('/api/v1/screen/individual')
            .set('Authorization', token)
            .query({
              lastName: 'mario'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toEqual(false);
        resolve('ok');
      });

    })
  });

  describe('If valid data was provided', () => {
    it('system should return a 200 response', () => {
      return new Promise(async (resolve) => {
        const res = await request(server)
          .get('/api/v1/screen/individual')
          .set('Authorization', token)
          .query({
            firstName: 'abc',
            lastName: 'def'
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toEqual(true);
        resolve('ok');
      });
    })
  });
});
