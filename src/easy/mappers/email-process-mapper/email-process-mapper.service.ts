import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { SESRecordDto } from '../../dto/ses-record.dto';
import { EmailProcess } from '../../entities/email-process.entity';

@Injectable()
export class EmailProcessMapperService extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, SESRecordDto, EmailProcess,
        forMember(d => d.spam, mapFrom(s => s.ses.receipt.spamVerdict.status === 'PASS')),
        forMember(d => d.virus, mapFrom(s => s.ses.receipt.virusVerdict.status === 'PASS')),
        forMember(d => d.dns, mapFrom(s =>
          s.ses.receipt.spfVerdict.status === 'PASS' &&
          s.ses.receipt.dkimVerdict.status === 'PASS' &&
          s.ses.receipt.dmarcVerdict.status === 'PASS',
        )),
        forMember(d => d.retrasado, mapFrom(s => s.ses.receipt.processingTimeMillis > 1000)),
        forMember(d => d.emisor, mapFrom(s => s.ses.mail.source.split('@')[0])),
        forMember(d => d.receptor, mapFrom(s => s.ses.mail.destination.map(d => d.split('@')[0]))),
      );
    };
  }
}
