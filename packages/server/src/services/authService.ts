import { RedisClientType } from 'redis';
import { saltRounds, tokenSignKey } from 'src/constants';

const jwt = require('jsonwebtoken');
const redis = require('redis');
const bcrypt = require('bcrypt');

class AuthService {
  client: RedisClientType;
  constructor() {
    this.client = redis.createClient({
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async initializeRedis() {
    await this.client.connect();
  }

  async createToken(user: string, expiresIn?: string) {
    let options: any = {};
    if (expiresIn) {
      options.expiresIn = expiresIn;
    }
    const token = jwt.sign(user, tokenSignKey, options);
    // await this.client.setEx(token, +(process.env.TOKEN_EXPIRY || 600000), JSON.stringify(user));
    return token;
  }

  async decodeAPiToken(token: string) {
    return this.client.get(token);
  }

  async removeToken(token: string) {
    return this.client.del(token);
  }

  async getHashedPassword(password: string) {
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(plaintextPassword: string, hash: string) {
    return bcrypt.compare(plaintextPassword, hash);
  }
}

const authService = new AuthService();
export default authService;
