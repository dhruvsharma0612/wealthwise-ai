// ─── WealthWise AI – NestJS Controller ───────────────────────────────────────

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WealthWiseAIService } from './services/ai.service';
import {
  validateAIResponse,
  PortfolioAnalysisSchema,
  GoalAnalysisSchema,
  FinancialHealthScoreSchema,
  MonthlyReviewSchema,
  BudgetAdviceSchema,
  DebtReductionSchema,
  RetirementPlanSchema,
} from './schemas/json-response.schemas';
import { isFeatureAvailable } from './features/premium.features';
import type { AIContextBundle, MonthlyReviewInput } from './interfaces';

// Replace with your actual auth guard
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
// @UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: WealthWiseAIService) {}

  // ─── Chat ─────────────────────────────────────────────────────────────────

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { bundle: AIContextBundle; message: string }) {
    const response = await this.aiService.chat(body.bundle, body.message);
    return { response };
  }

  // ─── Streaming Chat ────────────────────────────────────────────────────────

  @Post('chat/stream')
  async streamChat(
    @Body() body: { bundle: AIContextBundle; message: string },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of this.aiService.streamChat(body.bundle, body.message)) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }

  // ─── Portfolio Analysis ───────────────────────────────────────────────────

  @Post('portfolio/analyze')
  @HttpCode(HttpStatus.OK)
  async analyzePortfolio(@Body() body: { bundle: AIContextBundle }) {
    this.assertFeature('portfolio_analyzer', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.analyzePortfolio(body.bundle);
    return validateAIResponse(PortfolioAnalysisSchema, raw, 'portfolio-analysis');
  }

  // ─── Goal Analysis ─────────────────────────────────────────────────────────

  @Post('goals/:goalId/analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeGoal(
    @Param('goalId') goalId: string,
    @Body() body: { bundle: AIContextBundle },
  ) {
    this.assertFeature('goal_planner', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.analyzeGoal(body.bundle, goalId);
    return validateAIResponse(GoalAnalysisSchema, raw, 'goal-analysis');
  }

  // ─── Retirement Planning ───────────────────────────────────────────────────

  @Post('retirement/plan')
  @HttpCode(HttpStatus.OK)
  async planRetirement(
    @Body() body: { bundle: AIContextBundle; targetRetirementAge?: number },
  ) {
    this.assertFeature('retirement_forecasting', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.planRetirement(body.bundle, body.targetRetirementAge);
    return validateAIResponse(RetirementPlanSchema, raw, 'retirement-plan');
  }

  // ─── Budget Analysis ───────────────────────────────────────────────────────

  @Post('budget/analyze')
  @HttpCode(HttpStatus.OK)
  async analyzeBudget(@Body() body: { bundle: AIContextBundle; message: string }) {
    this.assertFeature('detailed_budget_analysis', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.analyzeBudget(body.bundle, body.message);
    return validateAIResponse(BudgetAdviceSchema, raw, 'budget-advice');
  }

  // ─── Debt Reduction ────────────────────────────────────────────────────────

  @Post('debt/plan')
  @HttpCode(HttpStatus.OK)
  async planDebt(@Body() body: { bundle: AIContextBundle }) {
    this.assertFeature('debt_advisor', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.planDebtReduction(body.bundle);
    return validateAIResponse(DebtReductionSchema, raw, 'debt-reduction');
  }

  // ─── Financial Health Score ────────────────────────────────────────────────

  @Post('health-score')
  @HttpCode(HttpStatus.OK)
  async getHealthScore(@Body() body: { bundle: AIContextBundle }) {
    // Health score available on all plans
    const raw = await this.aiService.generateHealthScore(body.bundle);
    return validateAIResponse(FinancialHealthScoreSchema, raw, 'health-score');
  }

  // ─── Monthly Review ────────────────────────────────────────────────────────

  @Post('review/monthly')
  @HttpCode(HttpStatus.OK)
  async monthlyReview(
    @Body() body: { bundle: AIContextBundle; review: MonthlyReviewInput },
  ) {
    this.assertFeature('monthly_review', body.bundle.user.subscriptionPlan);
    const raw = await this.aiService.generateMonthlyReview(body.bundle, body.review);
    return validateAIResponse(MonthlyReviewSchema, raw, 'monthly-review');
  }

  // ─── Feature Guard ─────────────────────────────────────────────────────────

  private assertFeature(feature: string, plan: string): void {
    if (!isFeatureAvailable(feature, plan as any)) {
      throw Object.assign(new Error(`Upgrade required to access ${feature}`), {
        statusCode: 403,
        feature,
        currentPlan: plan,
      });
    }
  }
}
