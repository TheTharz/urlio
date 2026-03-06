import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { GetAnalyticsDto } from '../dtos/get-analytics.dto';

export class AnalyticsController {
    public static getAnalytics = async (
        req: Request<GetAnalyticsDto>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { shortCode } = req.params;

            const analyticsData = await AnalyticsService.getAnalyticsByShortCode(shortCode);

            return res.status(200).json({
                success: true,
                data: analyticsData
            });
        } catch (error) {
            next(error);
        }
    };
}
