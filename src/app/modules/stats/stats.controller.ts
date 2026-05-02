import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { statsService } from "./stats.service";

const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await statsService.getDashboardStatsData(user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    })
});



const getPublicStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await statsService.getPublicStatsData();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    })
});



export const StatsController = {
    getDashboardStatsData,
    getPublicStatsData
}