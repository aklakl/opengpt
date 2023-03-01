import { Controller, Get, Logger, Query, Param, Put, UseGuards } from '@nestjs/common';
import { OpengptService } from './opengpt.service';


@Controller('opengpt')
export class OpengptController {
  constructor(private readonly opengptService: OpengptService) { }
  private readonly logger = new Logger(OpengptController.name);

  @Get('testCompletion')
  testOpengpt(
    @Query('content') content: string,
    @Query('engine') engine: string,
  ) {
    return this.opengptService.testOpengpt(content, engine);
  }

}
