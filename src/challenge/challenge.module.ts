import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  imports: [HttpModule],
})
export class ChallengeModule {
}
