import { Repository } from "./repository";

export class UserRepository extends Repository {
  constructor() {
    super();
  }

  async foo() {}
}

const userRepository = new UserRepository();
export default userRepository;
