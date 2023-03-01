import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class TypeOrmService
  implements TypeOrmOptionsFactory, OnApplicationShutdown {
  private readonly logger = new Logger(TypeOrmService.name);

  constructor(
    private readonly config: ConfigurationService,
    private dataSource: DataSource,
  ) { }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn('application shutdown ...');
    await this.closeDBConnection();
    this.logger.warn('application shutdown.');
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    //return this.config.getTypeOrmConfig();
    return null;
  }

  async closeDBConnection() {
    if (this.dataSource.isInitialized) {
      try {
        await this.dataSource.destroy();
        this.logger.log('DB conn closed');
      } catch (e) {
        this.logger.error('Error clossing conn to DB, ', e);
      }
    } else {
      this.logger.log('DB conn already closed.');
    }
  }
}
