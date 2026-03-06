import { prisma } from '../configs/database.config';
import { AnalyticsResponseDto } from '../dtos/analytics-response.dto';

export class AnalyticsService {
    public static async getAnalyticsByShortCode(shortCode: string): Promise<AnalyticsResponseDto> {
        // 1. Total Clicks
        const totalClicks = await prisma.clickEvent.count({
            where: { shortCode }
        });

        if (totalClicks === 0) {
            return {
                totalClicks: 0,
                clicksByDate: [],
                clicksByCountry: [],
                clicksByBrowser: [],
                clicksByOS: [],
                clicksByDevice: []
            };
        }

        // 2. Clicks by Country
        const clicksByCountry = await prisma.clickEvent.groupBy({
            by: ['country'],
            where: { shortCode, country: { not: null } },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10
        });

        // 3. Clicks by Browser
        const clicksByBrowser = await prisma.clickEvent.groupBy({
            by: ['browser'],
            where: { shortCode, browser: { not: null } },
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 10
        });

        // 4. Clicks by OS
        const clicksByOS = await prisma.clickEvent.groupBy({
            by: ['os'],
            where: { shortCode, os: { not: null } },
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 10
        });

        // 5. Clicks by Device
        const clicksByDevice = await prisma.clickEvent.groupBy({
            by: ['device'],
            where: { shortCode, device: { not: null } },
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } }
        });

        // 6. Recent Clicks (last 30 days time series)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentClicks = await prisma.clickEvent.findMany({
            where: {
                shortCode,
                timestamp: { gte: thirtyDaysAgo }
            },
            select: { timestamp: true },
            orderBy: { timestamp: 'asc' }
        });

        // Group by YYYY-MM-DD
        const clicksByDate = recentClicks.reduce((acc: any, curr) => {
            const date = curr.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return {
            totalClicks,
            clicksByDate: Object.keys(clicksByDate).map(date => ({
                date,
                count: clicksByDate[date]
            })),
            clicksByCountry: clicksByCountry.map(c => ({
                country: c.country ?? 'Unknown',
                count: c._count.country
            })),
            clicksByBrowser: clicksByBrowser.map(b => ({
                browser: b.browser ?? 'Unknown',
                count: b._count.browser
            })),
            clicksByOS: clicksByOS.map(o => ({
                os: o.os ?? 'Unknown',
                count: o._count.os
            })),
            clicksByDevice: clicksByDevice.map(d => ({
                device: d.device ?? 'Unknown',
                count: d._count.device
            }))
        };
    }
}
