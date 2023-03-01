import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PostgresServiceHealthIndicator } from './health-indicators/postgres-service.health-indicator';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigurationServiceHealthIndicator } from './health-indicators/configuration-service.health-indicator';
import { ExternalServiceHealthIndicator } from './health-indicators/external-service.health-indicator';
import { DatabricksServiceHealthIndicator } from './health-indicators/databricks-service.health-indicator';
import { EntityManager } from 'typeorm';

@Module({
  imports: [TerminusModule, EntityManager],
  controllers: [HealthController],
  providers: [
    PostgresServiceHealthIndicator,
    ConfigurationServiceHealthIndicator,
    ExternalServiceHealthIndicator,
    DatabricksServiceHealthIndicator,
    EntityManager,
  ],
})
export class HealthModule { }
