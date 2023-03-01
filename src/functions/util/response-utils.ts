import { CommonResponseDto } from '../../common/dto/common-response.dto';
import {
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

export function buildSuccessResponse<T>(data: T) {
  const response = new CommonResponseDto<T>();
  response.statusCode = 200;
  response.message = 'success';
  response.data = data;
  return response;
}

export async function AsyncBuildSuccessResponse<T>(promise: Promise<T>) {
  const response = new CommonResponseDto<T>();
  response.statusCode = 200;
  response.message = 'success';
  response.data = await promise;
  return response;
}

export function apiSchemal(type: string) {
  return {
    allOf: [
      { $ref: getSchemaPath(CommonResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          },
        },
      },
    ],
  };
}

export function validateErrorMessages(
  errors: ValidationError[],
  messages: string[] = [],
): string[] {
  return messages.concat(
    errors.flatMap(e => {
      if (e.children && e.children.length > 0) {
        return validateErrorMessages(e.children, messages);
      } else if (e.constraints) {
        return Object.values(e.constraints);
      }
    }),
  );
}
