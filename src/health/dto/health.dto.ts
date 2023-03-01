import { HealthStatus } from '../constants/health.constants';

export class Health {
  status: HealthStatus;

  connections: object;

  apiVersion: string;
}
