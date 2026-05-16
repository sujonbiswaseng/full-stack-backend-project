import { Request, Response } from "express"
import { catchAsync } from "../../shared/catchAsync"
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";
import status from "http-status";
import { redisService } from "../../lib/redis";
import AppError from "../../errorHelper/AppError";
const ragService=new RAGService()
const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "RAG stats retrieved successfully",
    data: result,
  });
});


const Ingestevents=catchAsync(async(req:Request,res:Response)=>{
   const result =await ragService.ingestEventData()
   console.log(result,'reselts')
   sendResponse(res,{
    success:true,
    message:"ingest event successfully",
   httpStatusCode:200,
   data:result
   })
})

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
    const cacheKey=`rag:query:${prompt}`

    try {
      const cacheResult = await redisService.get(cacheKey)
      
      if(cacheResult){
        return  sendResponse(res,{
          success:true,
          httpStatusCode:status.OK,
          message:"Answer retrieved from cache",
          data:cacheResult
        })
      }
    } catch (error:any) {
      console.log(error.status,'s')
      console.warn("Cache read error , proceeding with normal processing ",error)
    }

    // cache-miss

    let result;
    try {
      result = await ragService.generateSuggessions(
        prompt,
        true
      );
    } catch (error) {
      console.log("Error in ragService.generateSuggessions:", error);
      throw error;
    }

    try {
      let dataToCache = result?.answer.suggestions;
      if (!dataToCache || dataToCache===0 || dataToCache.length===0) {
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
            { title: "Cloud Computing Workshop" }
          ]
        };
      }
      await redisService.set(cacheKey, dataToCache, 600);
    } catch (error) {
      console.log("cache Write error", error);
    }

    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Suggestions generated successfully based on your input",
      data: result?.answer,
    });
  } catch(error:any) {
    if (error.response?.status === 429) {
      throw new Error(
        "Daily AI request limit exceeded. Please try again tomorrow or upgrade your API plan."
      );
    }
    throw new Error("Failed to generate AI response");
  }
});

const personalizedRecommendation = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      const userId = req.user?.userId;
      const viewerId = req.viewerId;

      // Check user authentication
      if (!userId) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.UNAUTHORIZED,
          message: "User ID not found. Please login.",
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
      const cacheKey = `rag:personalized:${userId}:${prompt}`;

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
          userId,
          viewerId,
          prompt,
          true
        );
      } catch (error) {
        console.error("Error in generatePersonalizedRecommendations:", error);
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.INTERNAL_SERVER_ERROR,
          message: "Failed to generate personalized recommendations from AI service.",
        });
      }

      console.log(result,'rsult')

      // Validate result structure
      if (
        !result ||
        !result.answer ||
        !Array.isArray(result.answer.recommendations) ||
        result.answer.recommendations.length === 0
      ) {
        return sendResponse(res, {
          success: false,
          httpStatusCode: status.BAD_REQUEST,
          message: "No recommendations found.",
        });
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
      // Handle rate limit or other known error types
      if (
        error?.message?.includes("429") ||
        error?.response?.status === 429
      ) {
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
  }
);

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status.BAD_REQUEST,
      message: "Query is required",
    });
  }
  // generate cache key from query params
  const cacheKey=`rag:query:${query}:${limit??5}:${sourceType||"all"}`

  try {
    const cacheResult = await redisService.get(cacheKey)
    if(cacheResult){
      // cache-hit
      const parseData=JSON.parse(cacheResult);
     return sendResponse(res,{
        success:true,
        httpStatusCode:status.OK,
        message:"Answer retrieved from cache",
        data:parseData
      })
    }
  } catch (error) {
    console.warn("Cache read error , proceeding with normal processing ",error)
  }

  // cache-miss

  const result = await ragService.generateAnswer(
    query,
    limit ?? 5,
    sourceType,
    true,
  );

  try {

   const dat= await redisService.set(cacheKey,result,600);
   console.log(dat,'da')
  } catch (error) {
    console.log("cache Write error",error)
  }

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Answer generated successfully",
    data: result,
  });
});
export const RagController={getStats,Ingestevents,queryRag,querySuggession,personalizedRecommendation}