import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";
import status from "http-status";
import { OpenRouter } from "@openrouter/sdk";
import { redisService } from "../../lib/redis";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
const ragService = new RAGService();
const openRouter = new OpenRouter({
  apiKey: envVars.RAG.OPENROUTER_API_KEY || "",
});

const keyInfo = await openRouter.apiKeys.getCurrentKeyMetadata();
const data = keyInfo.data;

if (data?.isFreeTier) {
  console.log("Free tier user");
}

if (data?.limitRemaining === 0) {
  throw new AppError(429, "Daily AI limit exceeded");
}

if (data?.expiresAt) {
  console.log("Key expires at:", data.expiresAt);
}

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  const openRouter = new OpenRouter({
    apiKey: envVars.RAG.OPENROUTER_API_KEY,
  });
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "RAG stats retrieved successfully",
    data: result,
  });
});

const Ingestevents = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.ingestEventData();
  console.log(result, "reselts");
  sendResponse(res, {
    success: true,
    message: "ingest event successfully",
    httpStatusCode: 200,
    data: result,
  });
});

const querySuggession = catchAsync(async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status.BAD_REQUEST,
        message: "prompt is required",
      });
    }
    // generate cache key from query params
    const cacheKey = `suggession:prompt:${prompt}`;

    try {
      const cacheResult = await redisService.get(cacheKey);

      if (cacheResult) {
        return sendResponse(res, {
          success: true,
          httpStatusCode: status.OK,
          message: "Answer retrieved from cache",
          data: cacheResult,
        });
      }
    } catch (error: any) {
      console.log(error.status, "s");
      console.warn(
        "Cache read error , proceeding with normal processing ",
        error,
      );
      throw Error
    }

    // cache-miss

    let result;
    try {
      result = await ragService.generateSuggessions(prompt, true);
    } catch (error) {
      console.log("Error in ragService.generateSuggessions:", error);
      throw error;
    }

    try {
      let dataToCache = result?.answer.suggestions;
      if (!dataToCache || dataToCache === 0 || dataToCache.length === 0) {
        dataToCache = {
          suggestions: [
            { title: "Tech Innovation Summit 2026" },
            { title: "Global AI Conference" },
            { title: "Frontend Developer Meetup" },
            { title: "Startup Networking Night" },
            { title: "Cyber Security Workshop" },
            { title: "Music Festival 2026" },
            { title: "UI/UX Design Masterclass" },
            { title: "Blockchain Expo" },
            { title: "Digital Marketing Bootcamp" },
            { title: "Cloud Computing Workshop" },
          ],
        };
      }
      await redisService.set(cacheKey, dataToCache, 600);
    } catch (error) {
      throw Error
    }

    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Suggestions generated successfully based on your input",
      data: result?.answer,
    });
  } catch (error: any) {
    const data = keyInfo.data;
    console.log(data,'data')

    if (data?.isFreeTier) {
      console.log("Free tier user");
    }

    if (data?.limitRemaining === 0 || data.limitRemaining==null) {
      throw new AppError(429, "Daily AI limit exceeded");
    }

    if (data?.expiresAt) {
      throw new AppError(400, `Key expires at: ${data.expiresAt}`);
    }
    if (error.response?.status === 429) {
      throw new Error(
        "Daily AI request limit exceeded. Please try again tomorrow or upgrade your API plan.",
      );
    }
    throw new Error("Failed to generate AI response");
  }
});

const personalizedRecommendation = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      const viewerId = req.viewerId;
      if (!viewerId) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.BAD_REQUEST,
          message: "viewerId is required",
        });
      }

      // Validate prompt
      if (!prompt) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.BAD_REQUEST,
          message: "prompt is required",
        });
      }

      // Create cache key
      const cacheKey = `personalizedRecommendation:prompt:${viewerId}:${prompt}`;

      // Try to get cached recommendation
      try {
        const cacheResult = await redisService.get(cacheKey);
        if (cacheResult) {
          return sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: "Personalized recommendations retrieved from cache",
            data: cacheResult,
          });
        }
      } catch (error: any) {
        console.error("PersonalizedRecommendation: Cache read error:", error);
        // Proceed without cache, but log error
      }

      // Generate recommendations (cache miss)
      let result;
      try {
        result = await ragService.generatePersonalizedRecommendations(
          viewerId,
          prompt,
          true,
        );
      } catch (error) {
       throw Error
      }

      console.log(result, "rsult");

      // Validate result structure
      if (
        !result ||
        !result.answer ||
        !Array.isArray(result.answer.recommendations) ||
        result.answer.recommendations.length === 0
      ) {
       throw Error
      }
      // Try to cache recommendations
      try {
        let dataToCache = result.answer.recommendations;
        await redisService.set(cacheKey, dataToCache, 600);
      } catch (error) {
        console.error("PersonalizedRecommendation: Cache write error:", error);
        // Still return success even if cache fails
      }

      // Return successful recommendation response
      return sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Personalized recommendations generated successfully",
        data: result.answer,
      });
    } catch (error: any) {
      const data = keyInfo.data;
      console.log(data,'data')
  
      if (data?.isFreeTier) {
        console.log("Free tier user");
      }
  
      if (data?.limitRemaining === 0 || data.limitRemaining==null) {
        throw new AppError(429, "Daily AI limit exceeded");
      }
  
      if (data?.expiresAt) {
        throw new AppError(400, `Key expires at: ${data.expiresAt}`);
      }
      // Handle rate limit or other known error types
      if (error?.message?.includes("429") || error?.response?.status === 429) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.TOO_MANY_REQUESTS,
          message: "Daily AI request limit exceeded. Please try again later.",
        });
      }

      // Log unexpected errors
      console.error("Personalized Recommendation Controller Error:", error);

      // Fallback to internal server error response
      return sendResponse(res, {
        success: false,
        httpStatusCode: status.INTERNAL_SERVER_ERROR,
        message: "Failed to generate personalized recommendations",
      });
    }
  },
);

const trendingItems = catchAsync(async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    let finalPrompt = prompt;
    if (!finalPrompt) {
      finalPrompt = "give me event trending items";
    }

    // Create cache key (trending, so distinguished key)
    const cacheKey = `trendingItems:prompt:${finalPrompt}`;

    // Try cache first
    try {
      const cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        const parsedData =
          typeof cacheResult === "string"
            ? JSON.parse(cacheResult)
            : cacheResult;
        return sendResponse(res, {
          success: true,
          httpStatusCode: status.OK,
          message: "Trending items retrieved from cache",
          data: parsedData,
        });
      }
    } catch (error: any) {
      throw Error
    }

    // Generate trending items using AI analysis of user activity
    let result;
    try {
      result = await ragService.generateTrendingItems(finalPrompt, true);
    } catch (error) {
     throw Error
    }

    // Validate result structure (expecting: { answer: { trending: [...] } })
    if (
      !result ||
      !result.answer ||
      !Array.isArray(result.answer.trending) ||
      result.answer.trending.length === 0
    ) {
     throw Error
    }

    // Try to cache trending items
    try {
      // Only cache trending array, not the whole result object
      await redisService.set(cacheKey, result.answer.trending, 600);
    } catch (error) {
      throw Error
    }

    // Return successful trending response
    return sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Trending items generated successfully",
      data: result.answer,
    });
  } catch (error: any) {
    const data = keyInfo.data;
    console.log(data,'data')

    if (data?.isFreeTier) {
      console.log("Free tier user");
    }

    if (data?.limitRemaining === 0 || data.limitRemaining==null) {
      throw new AppError(429, "Daily AI limit exceeded");
    }

    if (data?.expiresAt) {
      throw new AppError(400, `Key expires at: ${data.expiresAt}`);
    }
    // Handle AI rate limits
    if (error?.message?.includes("429") || error?.response?.status === 429) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status.TOO_MANY_REQUESTS,
        message: "Daily AI request limit exceeded. Please try again later.",
      });
    }
    return sendResponse(res, {
      success: false,
      httpStatusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to generate trending items",
    });
  }
});

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  try {
    if (!query) {
      return sendResponse(res, {
        success: false,
        httpStatusCode: status.BAD_REQUEST,
        message: "Query is required",
      });
    }
    // generate cache key from query params
    const cacheKey = `rag:query:${query}:${limit ?? 5}:${sourceType || "all"}`;

    try {
      const cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        // cache-hit
        const parseData = JSON.parse(cacheResult);
        return sendResponse(res, {
          success: true,
          httpStatusCode: status.OK,
          message: "Answer retrieved from cache",
          data: parseData,
        });
      }
    } catch (error) {
     throw Error
    }

    // cache-miss
    const result = await ragService.generateAnswer(
      query,
      limit ?? 5,
      sourceType,
      true,
    );

    if (
      !result ||
      !result.answer ||
      !Array.isArray(result.answer) ||
      result.answer.length === 0
    ) {
      throw Error
    }

    try {
      const dat = await redisService.set(cacheKey, result, 600);
      console.log(dat, "da");
    } catch (error) {
      console.log("cache Write error", error);
    }

    return sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Answer generated successfully",
      data: result,
    });
  } catch (err: any) {

    const data = keyInfo.data;
    console.log(data,'data')

    if (data?.isFreeTier) {
      console.log("Free tier user");
    }
    if (data?.limitRemaining === 0 || data.limitRemaining==null) {
      throw new AppError(429, "Daily AI limit exceeded");
    }

    if (data?.expiresAt) {
      throw new AppError(400, `Key expires at: ${data.expiresAt}`);
    }
    console.warn(
      "Cache read error , proceeding with normal processing ",
      err,
    );
    // Attempt to provide a meaningful error message and status code if available
    const httpStatus =
      err?.status || err?.statusCode || status.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error occurred while processing the request.";

    // Example for OpenRouter rate limit error (specific error handling)
    if (
      httpStatus === 429 ||
      (err?.message && err.message.includes("429")) ||
      (err?.message && err.message.includes("rate limit"))
    ) {
      message =
        "Rate limit exceeded on the LLM provider (OpenRouter). Please try again later or add credits if required.";
    } else if (err?.message) {
      message = err.message;
    }

    console.error("RAG Controller Error:", err);

    return sendResponse(res, {
      success: false,
      httpStatusCode: httpStatus,
      message,
    });
  }
});
export const RagController = {
  getStats,
  Ingestevents,
  queryRag,
  querySuggession,
  personalizedRecommendation,
  trendingItems,
};
