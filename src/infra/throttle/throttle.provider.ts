import { ThrottlerModule } from '@nestjs/throttler';
import { EnvModule } from '../config/env.module';
import { EnvService } from '../config/env.service';

export const ThrottleProvider = [
  ThrottlerModule.forRootAsync({
    imports: [EnvModule],
    inject: [EnvService],
    useFactory: ({ variables }: EnvService) => [
      { limit: variables.throttleLimit, ttl: variables.throttleTTL },
    ],
  }),
];
