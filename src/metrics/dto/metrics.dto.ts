import { ApiProperty } from '@nestjs/swagger';

export class Metrics {
  @ApiProperty({
    description: 'Healthy status',
    type: 'object',
  })
  healthy: boolean;
}
