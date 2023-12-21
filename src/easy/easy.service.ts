import { Injectable } from '@nestjs/common';
import { EmailProcess } from './entities/email-process.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { SESRecordDto } from './dto/ses-record.dto';
import { SESRecordBodyDto } from './dto/ses-record-body.dto';

@Injectable()
export class EasyService {

  constructor(@InjectMapper() private readonly classMapper: Mapper) {
  }

  processEmail(body: SESRecordBodyDto): EmailProcess[] {
    return this.classMapper.mapArray(body.Records, SESRecordDto, EmailProcess);
  }
}
