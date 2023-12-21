import { Module } from '@nestjs/common';
import { EasyService } from './easy.service';
import { EasyController } from './easy.controller';
import { EmailProcessMapperService } from './mappers/email-process-mapper/email-process-mapper.service';

@Module({
  controllers: [EasyController],
  providers: [EasyService, EmailProcessMapperService],
})
export class EasyModule {
}
