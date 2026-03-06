import api from "../lib/api";
import { AnalyticsResponseDto } from "../dtos/AnalyticsResponse.dto";

export const getAnalytics = async (shortCode: string): Promise<AnalyticsResponseDto> => {
    const response = await api.get<{ success: boolean; data: AnalyticsResponseDto }>(`/analytics/${shortCode}`);
    return response.data.data;
};
