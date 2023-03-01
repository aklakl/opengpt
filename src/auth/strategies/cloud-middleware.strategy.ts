import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
// import { OktaTokenAuth } from 'cloud-middleware';
import { Request } from 'express';

@Injectable()
export class CloudMiddlewareStrategy {
  private readonly logger = new Logger(CloudMiddlewareStrategy.name);
  private readonly errors = [];
  // private oktaTokenAuth: OktaTokenAuth;

  constructor(private readonly configurationService: ConfigurationService) {
    // const oktaSso =
    //   this.configurationService.getDeploymentConfigs().oktaSso || {};
    // this.oktaTokenAuth = new OktaTokenAuth({
    //   oktaSso,
    //   deployment: 'doesntMatterForHarvest',
    //   namespace: {},
    //   forceAuth: true,
    // });
  }

  async verify(request: Request) {
    console.debug('verify request = ' + JSON.stringify(request));
    //return this.oktaTokenAuth.authorize(request);
  }
}
