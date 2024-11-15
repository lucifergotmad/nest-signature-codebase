export interface ICacheService {
  set(key: string, value: any, ttl?: number): Promise<void>;
  get<T>(key: string): Promise<T>;
  delete(key: string): Promise<void>;
}
