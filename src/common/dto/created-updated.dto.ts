import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class CreatedUpdatedDto implements Readonly<CreatedUpdatedDto> {
  @ApiProperty()
  @Expose()
  createdAt?: Date;

  @ApiProperty()
  @Expose()
  updatedAt?: Date;
}
