export interface IHashService {
  generate(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
