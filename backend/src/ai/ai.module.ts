// ─── WealthWise AI – NestJS Module ───────────────────────────────────────────

import { Module } from '@nestjs/common';
import { WealthWiseAIService } from './services/ai.service';
import { AIController } from './ai.controller';

@Module({
  controllers: [AIController],
  providers: [WealthWiseAIService],
  exports: [WealthWiseAIService],
})
export class AIModule {}
