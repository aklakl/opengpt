import { Module } from '@nestjs/common';
import { MetricsController } from './controller/metrics.controller';
import { PostgresServiceHealthIndicator } from '../health/health-indicators/postgres-service.health-indicator';
import { ConfigurationServiceHealthIndicator } from '../health/health-indicators/configuration-service.health-indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [MetricsController],
  providers: [
    PostgresServiceHealthIndicator,
    ConfigurationServiceHealthIndicator,
  ],
})
export class MetricsModule {}
