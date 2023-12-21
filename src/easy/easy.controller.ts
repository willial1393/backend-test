import { Body, Controller, Post } from '@nestjs/common';
import { EasyService } from './easy.service';
import { EmailProcess } from './entities/email-process.entity';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { SESRecordBodyDto } from './dto/ses-record-body.dto';

@Controller('easy')
export class EasyController {
  constructor(private readonly easyService: EasyService) {
  }

  @Post('process-email')
  @ApiOperation({ summary: 'Process email records' })
  @ApiBody({ type: SESRecordBodyDto })
  @ApiCreatedResponse({
    description: 'Successfully processed email',
    type: EmailProcess,
  })
  processEmail(@Body() body: SESRecordBodyDto): EmailProcess[] {
    return this.easyService.processEmail(body);
  }

}
