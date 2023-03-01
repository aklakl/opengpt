import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
//import { AwsRequests } from '../airflow-restapi/request-aws';
import { ConfigService } from '@nestjs/config';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CachingService } from '../caching/caching.service';
import { schemaValidation } from '../common/helpers/schema-validator-helper';
import { initialBrazeConfig } from '../functions/constant/constant';
//import { initialGenerate } from '../functions/generate';

import _ from 'lodash';
import deploymentConfigSchema from './deploymentConfigSchema/schema.json';
import airflow from './environmentConfig/airflow.json';
import braze from './environmentConfig/braze.json';
import commonConfig from './environmentConfig/common-config.json';
import databricks from './environmentConfig/databricks.json';
import email from './environmentConfig/email.json';
import externalService from './environmentConfig/external-service.json';
import postgresqlCreds from './environmentConfig/postgresql-creds.json';
import testConfig from './environmentConfig/test-config.json';
import airflowSchema from './environmentConfigSchema/airflow-schema.json';
import brazeSchema from './environmentConfigSchema/braze-schema.json';
import commonConfigSchema from './environmentConfigSchema/common-config-schema.json';
import databricksSchema from './environmentConfigSchema/databricks-schema.json';
import emailSchema from './environmentConfigSchema/email-schema.json';
import externalServiceSchema from './environmentConfigSchema/external-service-schema.json';
import postgresqlCredsSchema from './environmentConfigSchema/postgresql-creds-schema.json';
import testConfigSchema from './environmentConfigSchema/test-config-schema.json';

export interface DeploymentConfigOptions {
  environment: string;
  region: string;
}

@Injectable()
export class ConfigurationService implements OnModuleInit {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    private readonly configService: ConfigService,
    private cachingService: CachingService,
  ) {
    initialBrazeConfig(configService);
    //AwsRequests.initialMwaaClient(configService);
    //initialGenerate(configService);
  }

  public async checkHealth(): Promise<void> {
    const errors: any[] =
      (await this.cachingService.getErrors(ConfigurationService.name)) || [];
    const isHealthy = errors.length === 0;
    if (!isHealthy) {
      const lastError = errors[errors.length - 1];
      throw new Error(lastError);
    }
  }

  public getConfigValue<T = any>(key: string): T {
    return this.configService.get(key);
  }

  public createDeploymentConfigOptions(): DeploymentConfigOptions {
    const { region, environment } = this.getConfigValue('environment');
    return { region, environment };
  }

  public getDeploymentConfigs(): any {
    return this.getConfigValue(this.getDeploymentConfigPath());
  }

  public getDeploymentConfigPath(): string {
    const { region, environment } = this.createDeploymentConfigOptions();
    return `${region}/${environment}`;
  }

  async saveValue(key: string, value: any): Promise<void> {
    await this.cachingService.set(key, value);
  }

  async getSavedValue(key: string): Promise<any> {
    const savedValue = this.cachingService.get(key);
    this.logger.log(
      `Retrieved cache results for key ${key}: ${JSON.stringify(savedValue)}`,
    );
    return savedValue;
  }

  public getCrusadeConfig() {
    return externalService.crusade;
  }

  public getGenearteConfig() {
    return externalService.generate;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const postgres = this.getConfigValue('postgresql');
    return {
      type: "sqlite",
      database: "shoppingDB",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true
    };
  }

  public getCampaignDefaultConfig(key: string) {
    const defaultPartnerConfiguration =
      this.getDeploymentConfigs().brazeConfig.defaultPartnerConfiguration;
    if (key) {
      return _.get(defaultPartnerConfiguration, key);
    }
    return defaultPartnerConfiguration;
  }

  public async schemaValidation(args: {
    schemaFile: any;
    jsonFile: any;
    fileName: string;
  }): Promise<void> {
    const { schemaFile, jsonFile, fileName } = args;
    const validation = schemaValidation({
      schemaFile,
      jsonFile,
    });
    if (!validation) {
      this.logger.debug(`Validated ${fileName}!`);
    } else {
      const stringifiedError: string = JSON.stringify(validation);
      const errorMessage = `Could not validate ${fileName} ${stringifiedError}`;
      this.logger.error(errorMessage);
      await this.cachingService.addError(
        errorMessage,
        ConfigurationService.name,
      );
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.schemaValidation({
        schemaFile: commonConfigSchema,
        jsonFile: commonConfig,
        fileName: 'commonConfigJson',
      });

      await this.schemaValidation({
        schemaFile: postgresqlCredsSchema,
        jsonFile: postgresqlCreds,
        fileName: 'postgresqlCredsJson',
      });

      await this.schemaValidation({
        schemaFile: databricksSchema,
        jsonFile: databricks,
        fileName: 'datarbricksJson',
      });

      await this.schemaValidation({
        schemaFile: externalServiceSchema,
        jsonFile: externalService,
        fileName: 'externalServiceJson',
      });

      await this.schemaValidation({
        schemaFile: brazeSchema,
        jsonFile: braze,
        fileName: 'braze',
      });

      await this.schemaValidation({
        schemaFile: airflowSchema,
        jsonFile: airflow,
        fileName: 'airflow',
      });

      await this.schemaValidation({
        schemaFile: emailSchema,
        jsonFile: email,
        fileName: 'email',
      });

      await this.schemaValidation({
        schemaFile: testConfigSchema,
        jsonFile: testConfig,
        fileName: 'test-config',
      });

      const deploymentConfigPath = this.getDeploymentConfigPath();

      await this.schemaValidation({
        schemaFile: deploymentConfigSchema,
        jsonFile: this.configService.get(deploymentConfigPath),
        fileName: `${deploymentConfigPath}/conf.json`,
      });
    } catch (err) {
      this.logger.error('Error in verifying environment config schemas', err);
    }
  }
}
