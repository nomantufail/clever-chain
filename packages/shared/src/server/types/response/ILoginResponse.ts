import User from './IUser';

export default interface ILoginResponse {
  user: User;
  token: string;
}
