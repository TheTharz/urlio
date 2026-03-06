export interface AnalyticsDataPoint {
    [key: string]: string | number;
    count: number;
}

export interface AnalyticsResponseDto {
    totalClicks: number;
    clicksByDate: AnalyticsDataPoint[];
    clicksByCountry: AnalyticsDataPoint[];
    clicksByBrowser: AnalyticsDataPoint[];
    clicksByOS: AnalyticsDataPoint[];
    clicksByDevice: AnalyticsDataPoint[];
}
