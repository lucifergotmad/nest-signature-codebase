import { IId } from 'src/core/interface/id.interface';

export interface UserResponseProps extends IId {
  fullname: string;
  email: string;
  username: string;
  role: string;
}
