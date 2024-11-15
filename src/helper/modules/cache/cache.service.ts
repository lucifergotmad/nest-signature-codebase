import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheService } from './cache.interface';

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: any, ttl?: number) {
    const expiredIn = this._getTTL(ttl);
    await this.cacheManager.set(key, value, expiredIn);
  }

  async get<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  async delete(key: string) {
    return await this.cacheManager.del(key);
  }

  private _getTTL(ttl = 15 * 60 * 1000): number {
    return ttl;
  }
}
