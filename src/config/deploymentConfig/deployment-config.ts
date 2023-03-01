import { LogLevel } from '../../common/logger';

type FeatureFlags = {
  enableNewRelicAgent: boolean;
  cors: boolean;
};

type NewRelicConfig = {
  appName: string;
};

type Cors = {
  allowList: string[];
};

type Target = 'pino-pretty';

type Logger = {
  name: string;
  level: LogLevel;
  transport?: {
    target: Target;
  };
};

type OktaConfig = {
  domainUrl: string;
  clientId: string;
};

export type DeploymentConfig = {
  featureFlags: FeatureFlags;
  newRelicConfig?: NewRelicConfig;
  logger: Logger;
  logLevel?: LogLevel;
  cors: Cors;
  oktaConfig: OktaConfig;
};
