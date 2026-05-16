import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelper/AppError";
import { aiService } from "./ai.service";

const searchSuggestions = catchAsync(async (req: Request, res: Response) => {
  try {
    const  {prompt} = req.body;

    if (!prompt || typeof prompt !== "string") {
      throw new AppError(400, "Search query is required");
    }

    const result = await aiService.searchSuggestions(
      prompt
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Search suggestions generated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error.status,'error')
    if(error.status===429){
      throw new AppError(429, "Too many requests: Daily search limit reached");
 
    }
    throw new AppError(400, error.message);
  }
});

/* ---------------- PERSONALIZED RECOMMENDATIONS ---------------- */

// const getRecommendations = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       throw new AppError(401, "Unauthorized: User not found");
//     }

//     const result = await aiSearchService.getRecommendations(
//       user.userId,
//       user.email
//     );

//     sendResponse(res, {
//       httpStatusCode: 200,
//       success: true,
//       message: "Recommendations fetched successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     logger.error(error.message, "getRecommendations error");
//     throw new AppError(400, error.message);
//   }
// });

/* ---------------- TRENDING ITEMS ---------------- */

// const getTrending = catchAsync(async (_req: Request, res: Response) => {
//   try {
//     const result = await aiSearchService.getTrending();

//     sendResponse(res, {
//       httpStatusCode: 200,
//       success: true,
//       message: "Trending items fetched successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     logger.error(error.message, "getTrending error");
//     throw new AppError(400, error.message);
//   }
// });

export const aiSearchController = {
  searchSuggestions,
  // getRecommendations,
  // getTrending,
};