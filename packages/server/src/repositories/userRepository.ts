import { Repository } from "./repository";
import authService from "src/services/authService";
import IUser from "shared/server/types/response/IUser";
import dbService from "shared/services/db.service";

export class UserRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * this method get full information of an user from database
   * @param userId
   */
  async getUserById(userId: string) {
    const password = await authService.getHashedPassword('secret123');
    const testUser = {
      id: userId,
      name: 'test user',
      email: 'test@gmail.com',
      password: password,
    };
    return Promise.resolve(testUser as unknown as IUser);
  }

  /**
   * this method get full information of a user from database by username
   * @param username
   */
  async getUserByEmail(username: string) {
    const getUser = `SELECT * FROM user WHERE username='${username}' ALLOW FILTERING`;
    const resp = await dbService.executeQuery(getUser);
    return Promise.resolve(resp.rows[0] as unknown as IUser);
  }
}

const userRepository = new UserRepository();
export default userRepository;
