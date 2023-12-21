import { ApiProperty } from '@nestjs/swagger';
import { SESRecordDto } from './ses-record.dto';

export class SESRecordBodyDto {
  @ApiProperty({ type: [SESRecordDto] })
  Records: SESRecordDto[];
}
