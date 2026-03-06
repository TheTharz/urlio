"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAnalytics } from "@/services/analytics.service";
import { AnalyticsResponseDto } from "@/dtos/AnalyticsResponse.dto";
import { showError } from "@/lib/toast";

export default function AnalyticsDashboard() {
    const params = useParams();
    const router = useRouter();
    const shortCode = params.shortCode as string;

    const [data, setData] = useState<AnalyticsResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!shortCode) return;

        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const result = await getAnalytics(shortCode);
                setData(result);
            } catch (error) {
                showError("Failed to load analytics data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [shortCode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center text-white pt-32">
                <h2 className="text-3xl font-bold mb-4">Analytics Not Found</h2>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Go Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors text-sm font-medium"
                    >
                        &larr; Back to Dashboard
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Analytics Overview</h1>
                    <p className="text-gray-400 text-lg">
                        Stats for <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">/{shortCode}</span>
                    </p>
                </div>

                <div className="mt-6 md:mt-0 bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center min-w-[200px]">
                    <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">Total Clicks</p>
                    <p className="text-5xl font-bold">{data.totalClicks}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-6">Clicks Over Time (Last 30 Days)</h3>
                    {data.clicksByDate.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.clicksByDate}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9CA3AF"
                                        tick={{ fill: '#9CA3AF' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => {
                                            const date = new Date(val);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        }}
                                    />
                                    <YAxis
                                        stroke="#9CA3AF"
                                        tick={{ fill: '#9CA3AF' }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#ffffff"
                                        strokeWidth={3}
                                        dot={{ fill: '#000', stroke: '#fff', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#fff' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            No click data available yet.
                        </div>
                    )}
                </div>

                {/* Breakdown Section */}
                <div className="flex flex-col gap-6">
                    <BreakdownCard title="Top Countries" data={data.clicksByCountry} dataKey="country" />
                    <BreakdownCard title="Top Devices" data={data.clicksByDevice} dataKey="device" />
                    <BreakdownCard title="Top Browsers" data={data.clicksByBrowser} dataKey="browser" />
                    <BreakdownCard title="Top OS" data={data.clicksByOS} dataKey="os" />
                </div>

            </div>
        </div>
    );
}

// Helper Component for Breakdown Lists
function BreakdownCard({ title, data, dataKey }: { title: string, data: any[], dataKey: string }) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">{title}</h3>
            {data.length > 0 ? (
                <div className="space-y-4">
                    {data.slice(0, 5).map((item, idx) => {
                        const percentage = Math.round((item.count / total) * 100) || 0;
                        return (
                            <div key={idx} className="flex flex-col gap-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300 capitalize truncate pr-4">{item[dataKey] || 'Unknown'}</span>
                                    <span className="text-white font-medium">{item.count} <span className="text-gray-500 font-normal">({percentage}%)</span></span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-white h-1.5 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-500">No data available.</p>
            )}
        </div>
    );
}
