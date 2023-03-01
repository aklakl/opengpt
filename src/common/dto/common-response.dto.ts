import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty({
    default: 200,
  })
  public statusCode: number;
  @ApiProperty({
    default: 'success',
  })
  public message: string;
  @ApiHideProperty()
  public data: T;
}
