import { IId } from 'src/core/interface/id.interface';

export interface UserResponseProps extends IId {
  username: string;
  level: string;
}
