import { ConfigService } from '@nestjs/config';

export function configurationServiceFactory(): ConfigService {
  return new ConfigService();
}
