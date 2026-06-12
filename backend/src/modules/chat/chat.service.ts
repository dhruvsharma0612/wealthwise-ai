import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../../services/prisma";
import { cache } from "../../services/redis";
import { AppError } from "../../middleware/errorHandler";
import { logger } from "../../services/logger";
import { aiContextBundleService } from "../ai-context/ai-context-bundle.service";
import { buildMessages, WEALTHWISE_SYSTEM_PROMPT } from "../ai-context/ai-context.prompt";

const MODEL      = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;
const FREE_DAILY_LIMIT    = 10;
const PRO_DAILY_LIMIT     = 50;
const PREMIUM_DAILY_LIMIT = 200;

function getDailyLimit(plan: string): number {
  if (plan === "PREMIUM" || plan === "ELITE") return PREMIUM_DAILY_LIMIT;
  if (plan === "PRO")                         return PRO_DAILY_LIMIT;
  return FREE_DAILY_LIMIT;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class ChatService {
  private readonly claude: Anthropic;

  constructor() {
    this.claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  // ─── Send message ───────────────────────────────────────────────────────────

  async sendMessage(
    userId:    string,
    sessionId: string,
    userMsg:   string,
    plan:      string,
  ): Promise<{ reply: string; tokensUsed: number }> {

    // Rate limit check
    const dailyCount = await cache.getAiQueryCount(userId);
    const limit      = getDailyLimit(plan);
    if (dailyCount >= limit) {
      throw new AppError(
        `Daily AI message limit reached (${limit}). ${plan === "FREE" ? "Upgrade to Pro for more." : "Resets at midnight."}`,
        429,
        "RATE_LIMIT_EXCEEDED",
      );
    }

    // Verify session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new AppError("Chat session not found", 404, "SESSION_NOT_FOUND");

    // Build full AI context
    const bundle  = await aiContextBundleService.build(userId, sessionId);
    const history = bundle.recentChats.map((m) => ({
      role:    m.role as "user" | "assistant",
      content: m.content,
    }));

    const { system, messages } = buildMessages(bundle, userMsg, history);

    // Save user message first
    await prisma.chatMessage.create({
      data: { sessionId, role: "user", content: userMsg },
    });

    // Call Claude
    let reply      = "";
    let tokensUsed = 0;

    try {
      const response = await this.claude.messages.create({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages,
      });

      const block = response.content.find((b) => b.type === "text");
      reply      = block?.type === "text" ? block.text : "I could not generate a response. Please try again.";
      tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    } catch (err: unknown) {
      logger.error("Claude API error", { err, userId, sessionId });
      throw new AppError("AI service temporarily unavailable. Please try again.", 503, "AI_UNAVAILABLE");
    }

    // Save assistant reply + update counters in parallel
    await Promise.all([
      prisma.chatMessage.create({
        data: { sessionId, role: "assistant", content: reply, tokens: tokensUsed },
      }),
      prisma.user.update({
        where: { id: userId },
        data:  { aiQueriesUsed: { increment: 1 } },
      }),
      cache.incrementAiQueryCount(userId),
      // Update session title on first message
      !session.title
        ? prisma.chatSession.update({
            where: { id: sessionId },
            data:  { title: userMsg.slice(0, 60) },
          })
        : Promise.resolve(),
    ]);

    logger.info("Chat message processed", { userId, sessionId, tokensUsed });
    return { reply, tokensUsed };
  }

  // ─── Streaming ──────────────────────────────────────────────────────────────

  async *streamMessage(
    userId:    string,
    sessionId: string,
    userMsg:   string,
    plan:      string,
  ): AsyncGenerator<string, void, unknown> {

    const dailyCount = await cache.getAiQueryCount(userId);
    if (dailyCount >= getDailyLimit(plan)) {
      throw new AppError("Daily AI message limit reached", 429, "RATE_LIMIT_EXCEEDED");
    }

    const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) throw new AppError("Chat session not found", 404);

    const bundle  = await aiContextBundleService.build(userId, sessionId);
    const history = bundle.recentChats.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    const { system, messages } = buildMessages(bundle, userMsg, history);

    await prisma.chatMessage.create({ data: { sessionId, role: "user", content: userMsg } });

    let fullReply  = "";
    let tokensUsed = 0;

    const stream = await this.claude.messages.stream({
      model: MODEL, max_tokens: MAX_TOKENS, system, messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        fullReply += chunk.delta.text;
        yield chunk.delta.text;
      }
      if (chunk.type === "message_delta") {
        tokensUsed = chunk.usage.output_tokens;
      }
    }

    await Promise.all([
      prisma.chatMessage.create({ data: { sessionId, role: "assistant", content: fullReply, tokens: tokensUsed } }),
      prisma.user.update({ where: { id: userId }, data: { aiQueriesUsed: { increment: 1 } } }),
      cache.incrementAiQueryCount(userId),
    ]);
  }

  // ─── Session management ─────────────────────────────────────────────────────

  async createSession(userId: string): Promise<{ sessionId: string }> {
    const session = await prisma.chatSession.create({ data: { userId } });
    return { sessionId: session.id };
  }

  async getSessions(userId: string) {
    return prisma.chatSession.findMany({
      where:   { userId },
      orderBy: { updatedAt: "desc" },
      take:    20,
      select:  { id: true, title: true, createdAt: true, updatedAt: true },
    });
  }

  async getMessages(userId: string, sessionId: string) {
    const session = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!session) throw new AppError("Session not found", 404);
    return prisma.chatMessage.findMany({
      where:   { sessionId },
      orderBy: { createdAt: "asc" },
      select:  { id: true, role: true, content: true, tokens: true, createdAt: true },
    });
  }

  async deleteSession(userId: string, sessionId: string) {
    await prisma.chatSession.deleteMany({ where: { id: sessionId, userId } });
    return { success: true };
  }
}

export const chatService = new ChatService();
