import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeploymentConfigOptions } from '../../config/configuration.service';
import externalService from '../../config/environmentConfig/external-service.json';

//This is similar with ConfigurationService(../../config/configuration.service)
export class ConfigurationServiceUtils {
  private readonly logger = new Logger(ConfigurationServiceUtils.name);
  private configService: ConfigService;
  constructor() {
    this.logger.debug('ConfigurationServiceUtils constructor');
  }

  public setConfigService(config: ConfigService) {
    return (this.configService = config);
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
  public getCrusadeConfig() {
    return externalService.crusade;
  }

  public getGenearteConfig() {
    return externalService.generate;
  }
}

export const configurationServiceUtilsIns: ConfigurationServiceUtils =
  new ConfigurationServiceUtils();

export function initialConfigurationServiceUtils(config: ConfigService) {
  configurationServiceUtilsIns.setConfigService(config);
}
