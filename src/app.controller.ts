import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExtraModels } from '@nestjs/swagger';
import { CommonResponseDto } from './common/dto/common-response.dto';

@ApiExtraModels(CommonResponseDto) //export common schema
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion() {
    return {
      imageTag: process.env.ECR_IMAGE_TAG,
      apiVersion: process.env.PACKAGE_JSON_VERSION,
    };
  }
}
