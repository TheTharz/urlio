"use client";
import { getAllUrls } from "@/services/shorten.service";
import { useState, useEffect } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";
import Link from "next/link";

export default function DashboardPage() {
    const [recentLinks, setRecentLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentLinks();
    }, []);

    const fetchRecentLinks = async () => {
        try {
            setLoading(true);
            const links = await getAllUrls();
            setRecentLinks(links || []);
        } catch (error) {
            console.error("Failed to load recent links", error);
            showError("Failed to load your links.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (textToCopy: string) => {
        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                showSuccess(toastMessages.copied);
            } catch (error) {
                showError(toastMessages.copyFailed);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Manage and track your shortened URLs.</p>
                </div>
                <Link
                    href="/"
                    className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    + Shorten New URL
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
                {loading ? (
                    <div className="p-12 flex justify-center text-gray-500">
                        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                ) : recentLinks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 border-b border-gray-800 text-gray-400 text-sm">
                                    <th className="p-5 font-medium">Original URL</th>
                                    <th className="p-5 font-medium">Short URL</th>
                                    <th className="p-5 font-medium">Date Created</th>
                                    <th className="p-5 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {recentLinks.map((link, idx) => {
                                    const shortUrlFull = `http://localhost:5002/r/${link.shortCode}`;
                                    return (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center shrink-0">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                    </div>
                                                    <p className="text-gray-300 text-sm truncate max-w-xs md:max-w-sm lg:max-w-md" title={link.url}>
                                                        {link.url}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <a href={shortUrlFull} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors block truncate max-w-[200px]">
                                                    {shortUrlFull}
                                                </a>
                                            </td>
                                            <td className="p-5 text-gray-400 text-sm">
                                                {new Date(link.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleCopy(shortUrlFull)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                                        title="Copy short link"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    </button>
                                                    <Link
                                                        href={`/analytics/${link.shortCode}`}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                        Stats
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No links found</h3>
                        <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                            You haven&apos;t shortened any URLs yet. Get started by creating your first short link.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Shorten a URL
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
