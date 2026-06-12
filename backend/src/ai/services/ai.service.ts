// ─── WealthWise AI – Core AI Service (NestJS) ────────────────────────────────

import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { WEALTHWISE_MASTER_SYSTEM_PROMPT } from '../prompts/system.prompt';
import {
  buildFinancialCoachPrompt,
  buildPortfolioAnalyzerPrompt,
  buildGoalPlannerPrompt,
  buildRetirementPlannerPrompt,
  buildBudgetAdvisorPrompt,
  buildDebtAdvisorPrompt,
  buildHealthScorePrompt,
  buildMonthlyReviewPrompt,
} from '../prompts/specialized.prompts';
import { calculateFinancialHealthScore, calculateFinancialMetrics } from '../scoring/health-score';
import type {
  AIContextBundle,
  MonthlyReviewInput,
  PortfolioAnalysisResponse,
  GoalAnalysisResponse,
  FinancialHealthScoreResponse,
  MonthlyReviewResponse,
  BudgetAdviceResponse,
  DebtReductionResponse,
  RetirementPlanResponse,
} from '../interfaces';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;

@Injectable()
export class WealthWiseAIService {
  private readonly logger = new Logger(WealthWiseAIService.name);
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // ─── Core Conversation (Financial Coach) ───────────────────────────────────

  async chat(bundle: AIContextBundle, userMessage: string): Promise<string> {
    const userPrompt = buildFinancialCoachPrompt(bundle, userMessage);

    const messages: Anthropic.MessageParam[] = [
      ...(bundle.conversationHistory?.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })) ?? []),
      { role: 'user', content: userPrompt },
    ];

    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: WEALTHWISE_MASTER_SYSTEM_PROMPT,
      messages,
    });

    return this.extractText(response);
  }

  // ─── Portfolio Analysis ─────────────────────────────────────────────────────

  async analyzePortfolio(bundle: AIContextBundle): Promise<PortfolioAnalysisResponse> {
    const prompt = buildPortfolioAnalyzerPrompt(bundle);
    return this.callWithJSONResponse<PortfolioAnalysisResponse>(prompt);
  }

  // ─── Goal Analysis ──────────────────────────────────────────────────────────

  async analyzeGoal(bundle: AIContextBundle, goalId: string): Promise<GoalAnalysisResponse> {
    const prompt = buildGoalPlannerPrompt(bundle, goalId);
    return this.callWithJSONResponse<GoalAnalysisResponse>(prompt);
  }

  // ─── Retirement Planning ────────────────────────────────────────────────────

  async planRetirement(
    bundle: AIContextBundle,
    targetRetirementAge?: number,
  ): Promise<RetirementPlanResponse> {
    const prompt = buildRetirementPlannerPrompt(bundle, targetRetirementAge);
    return this.callWithJSONResponse<RetirementPlanResponse>(prompt);
  }

  // ─── Budget Advice ──────────────────────────────────────────────────────────

  async analyzeBudget(
    bundle: AIContextBundle,
    userMessage: string,
  ): Promise<BudgetAdviceResponse> {
    const prompt = buildBudgetAdvisorPrompt(bundle, userMessage);
    return this.callWithJSONResponse<BudgetAdviceResponse>(prompt);
  }

  // ─── Debt Reduction Plan ────────────────────────────────────────────────────

  async planDebtReduction(bundle: AIContextBundle): Promise<DebtReductionResponse> {
    const prompt = buildDebtAdvisorPrompt(bundle);
    return this.callWithJSONResponse<DebtReductionResponse>(prompt);
  }

  // ─── Financial Health Score ─────────────────────────────────────────────────

  async generateHealthScore(bundle: AIContextBundle): Promise<FinancialHealthScoreResponse> {
    // First calculate deterministic base score
    const baseScore = calculateFinancialHealthScore(
      bundle.user,
      bundle.portfolio,
      bundle.goals,
      bundle.metrics,
    );

    // Then enrich with AI narrative
    const prompt = buildHealthScorePrompt(bundle);
    const aiScore = await this.callWithJSONResponse<FinancialHealthScoreResponse>(prompt);

    // Trust AI score but validate it's close to deterministic score
    const scoreDelta = Math.abs(aiScore.score - baseScore.score);
    if (scoreDelta > 15) {
      this.logger.warn(
        `AI score (${aiScore.score}) deviates significantly from deterministic score (${baseScore.score}) for user ${bundle.user.id}`,
      );
      // Use deterministic score components, AI narrative
      aiScore.score = baseScore.score;
      aiScore.grade = baseScore.grade;
      aiScore.breakdown = baseScore.breakdown;
    }

    return aiScore;
  }

  // ─── Monthly Review ─────────────────────────────────────────────────────────

  async generateMonthlyReview(
    bundle: AIContextBundle,
    review: MonthlyReviewInput,
  ): Promise<MonthlyReviewResponse> {
    const prompt = buildMonthlyReviewPrompt(bundle, review);
    return this.callWithJSONResponse<MonthlyReviewResponse>(prompt);
  }

  // ─── Streaming Chat (for real-time UX) ─────────────────────────────────────

  async *streamChat(
    bundle: AIContextBundle,
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const userPrompt = buildFinancialCoachPrompt(bundle, userMessage);

    const stream = await this.client.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: WEALTHWISE_MASTER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }
  }

  // ─── Internal Helpers ───────────────────────────────────────────────────────

  private async callWithJSONResponse<T>(userPrompt: string): Promise<T> {
    const response = await this.client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: WEALTHWISE_MASTER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = this.extractText(response);
    return this.parseJSON<T>(text);
  }

  private extractText(response: Anthropic.Message): string {
    const block = response.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      throw new Error('No text content in AI response');
    }
    return block.text;
  }

  private parseJSON<T>(text: string): T {
    // Strip any accidental markdown code fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      this.logger.error(`Failed to parse AI JSON response: ${cleaned.slice(0, 200)}`);
      throw new Error('AI returned invalid JSON — please retry');
    }
  }
}
