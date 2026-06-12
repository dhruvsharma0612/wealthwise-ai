import axios from "axios";
import { cache } from "../../services/redis";
import { AppError } from "../../middleware/errorHandler";
import { logger } from "../../services/logger";

const CACHE_TTL = {
  FREE:    15 * 60,
  PREMIUM: 60,
};

const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

export class MarketService {
  private async fetchFromAlphaVantage(params: Record<string, string>) {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          ...params,
          apikey: process.env.ALPHA_VANTAGE_KEY,
        },
        timeout: 10000,
      });

      if (response.data["Note"] || response.data["Information"]) {
        logger.warn("Alpha Vantage rate limit hit");
        throw new AppError(
          "Market data temporarily unavailable",
          503,
          "MARKET_RATE_LIMIT"
        );
      }

      return response.data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error("Alpha Vantage fetch failed", { err });
      throw new AppError("Failed to fetch market data", 503);
    }
  }

  async getQuote(symbol: string, plan: string) {
    const ttl      = plan === "PREMIUM" ? CACHE_TTL.PREMIUM : CACHE_TTL.FREE;
    const cacheKey = `market:quote:${symbol.toUpperCase()}`;

    const cached = await cache.get<object>(cacheKey);
    if (cached) return { ...cached, cached: true };

    const data = await this.fetchFromAlphaVantage({
      function: "GLOBAL_QUOTE",
      symbol:   symbol.toUpperCase(),
    });

    const quote = data["Global Quote"];
    if (!quote || !quote["01. symbol"]) {
      throw new AppError(`Symbol ${symbol} not found`, 404, "SYMBOL_NOT_FOUND");
    }

    const result = {
      symbol:        quote["01. symbol"],
      price:         parseFloat(quote["05. price"]),
      change:        parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"]),
      volume:        parseInt(quote["06. volume"]),
      high:          parseFloat(quote["03. high"]),
      low:           parseFloat(quote["04. low"]),
      prevClose:     parseFloat(quote["08. previous close"]),
      updatedAt:     new Date().toISOString(),
    };

    await cache.set(cacheKey, result, ttl);
    return { ...result, cached: false };
  }

  async searchSymbol(query: string) {
    const cacheKey = `market:search:${query.toLowerCase()}`;
    const cached   = await cache.get<object[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchFromAlphaVantage({
      function: "SYMBOL_SEARCH",
      keywords: query,
    });

    const results = (data.bestMatches || [])
      .slice(0, 10)
      .map((m: Record<string, string>) => ({
        symbol:   m["1. symbol"],
        name:     m["2. name"],
        type:     m["3. type"],
        region:   m["4. region"],
        currency: m["8. currency"],
      }));

    await cache.set(cacheKey, results, 60 * 60);
    return results;
  }

  async getExchangeRate(from: string, to: string) {
    const cacheKey = `market:fx:${from}-${to}`;
    const cached   = await cache.get<object>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchFromAlphaVantage({
      function:      "CURRENCY_EXCHANGE_RATE",
      from_currency: from,
      to_currency:   to,
    });

    const rate   = data["Realtime Currency Exchange Rate"];
    const result = {
      from,
      to,
      rate:      parseFloat(rate["5. Exchange Rate"]),
      updatedAt: rate["6. Last Refreshed"],
    };

    await cache.set(cacheKey, result, 5 * 60);
    return result;
  }

  async getTopMovers() {
    const cacheKey = "market:top-movers";
    const cached   = await cache.get<object>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchFromAlphaVantage({
      function: "TOP_GAINERS_LOSERS",
    });

    const result = {
      topGainers: (data.top_gainers || []).slice(0, 5),
      topLosers:  (data.top_losers  || []).slice(0, 5),
      updatedAt:  new Date().toISOString(),
    };

    await cache.set(cacheKey, result, 15 * 60);
    return result;
  }
}

export const marketService = new MarketService();
