import { Controller, Get, Param } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {
  }

  @Get('get-json-from-email/:urlOrPath')
  @ApiOperation({ summary: 'Get JSON from email URL' })
  @ApiParam({
    name: 'urlOrPath',
    description: 'URL or path of the email',
    required: true,
    type: String,
    examples: {
      '(Url) From attachment': {
        value:
          'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/Solo%20adjunto.eml?alt=media&token=53d82b27-42fb-4f42-8e82-a1dd55c6da57',
      },
      '(Url) From link on body': {
        value:
          'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/link%20en%20el%20correo.eml?alt=media&token=9c202043-8dd5-4f7b-ab1a-c9024ca817e9',
      },
      '(Url) From page on link body': {
        value:
          'https://firebasestorage.googleapis.com/v0/b/backend-test-eaefe.appspot.com/o/Json%20en%20la%20pa%CC%81gina.eml?alt=media&token=a49e42c8-24b5-4166-91c7-ecb18008ab4d',
      },
      '(Path) From attachment': {
        value: 'emails/attachment.eml',
      },
      '(Path) From link on body': {
        value: 'emails/link.eml',
      },
      '(Path) From page on link body': {
        value: 'emails/page.eml',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Return JSON from email URL or path',
  })
  findOne(@Param('urlOrPath') urlOrPath: string): any {
    return this.challengeService.getJsonFromEmail(urlOrPath);
  }
}
