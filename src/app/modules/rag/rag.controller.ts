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
    const cacheKey = `rag:query:${prompt}`;

    // 1. Try retrieving from cache.
    let cacheResult: any = null;
    try {
      cacheResult = await redisService.get(cacheKey);
      if (cacheResult) {
        // Try to parse if possible, fallback to raw
        let dataFromCache = cacheResult;
        try {
          dataFromCache = typeof cacheResult === 'string' ? JSON.parse(cacheResult) : cacheResult;
        } catch (e) {
          // It was not a stringified JSON, it's fine
        }
        return sendResponse(res, {
          success: true,
          httpStatusCode: status.OK,
          message: "Answer retrieved from cache",
          data: dataFromCache
        });
      }
    } catch (error: any) {
      console.error("Cache read error in querySuggession:", error);
      // Continue to regenerate if cache fails
    }

    // 2. Cache Miss - Call ragService.generateSuggessions
    let result: any;
    try {
      result = await ragService.generateSuggessions(prompt, true);
    } catch (error: any) {
      console.error("Error in ragService.generateSuggessions:", error);
      // For rate limit error
      if (error?.response?.status === 429) {
        throw new AppError(429, "Daily AI request limit exceeded. Please try again tomorrow or upgrade your API plan.");
      }
      throw new AppError(500, "Failed to generate AI suggestions");
    }

    // 3. Prepare data for cache (including fallback)
    let dataToCache = result?.answer?.suggestions;
    if (!dataToCache || !Array.isArray(dataToCache) || dataToCache.length === 0) {
      dataToCache = [
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
      ];
    }

    // 4. Try to write to cache
    try {
      // Always cache array of suggestions for consistency
      await redisService.set(cacheKey, dataToCache, 600);
    } catch (error: any) {
      console.error("Cache write error in querySuggession:", error);
    }

    // 5. Send successful response
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: "Answer generated successfully",
      data: { suggestions: dataToCache },
    });
  } catch (error: any) {
    console.error("Uncaught error in querySuggession:", error);
    if (error instanceof AppError) {
      // Custom error - forward it
      throw error;
    }
    // Fallback generic error
    throw new AppError(500, "Failed to generate AI response");
  }
});

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

  console.log(cacheKey,'es')
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
    // store cache with 10 min(600 secound)
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
export const RagController={getStats,Ingestevents,queryRag,querySuggession}