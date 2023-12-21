import { ApiProperty } from '@nestjs/swagger';

export class EmailProcess {
  @ApiProperty({
    description: 'Boolean indicating spam verdict, PASS = true',
  })
  spam: boolean;

  @ApiProperty({
    description: 'Boolean indicating virus verdict, PASS = true',
  })
  virus: boolean;

  @ApiProperty({
    description:
      'Boolean indicating if all DNS veredicts (spf, dkim, dmarc) are PASS = true',
  })
  dns: boolean;

  @ApiProperty({
    description: 'Month extracted from mail timestamp',
  })
  mes: string;

  @ApiProperty({
    description: 'Boolean indicating if processing time is greater than 1000',
  })
  retrasado: boolean;

  @ApiProperty({
    description: 'Email sender without domain',
  })
  emisor: string;

  @ApiProperty({
    description: 'Array of email receivers without domain',
    type: [String],
  })
  receptor: string[];
}
