"use client";
import { ShortUrlRequestDTO } from "@/dtos/ShortUrlRequest.dto";
import { shortenUrl } from "@/services/shorten.service";
import { useState } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      showError(toastMessages.emptyUrl);
      return;
    }

    setLoading(true);
    try {
      const urlData: ShortUrlRequestDTO = {
        url: url
      };
      const shortUrlResponse = await shortenUrl(urlData);

      if (shortUrlResponse) {
        setShortUrl(shortUrlResponse.shortUrl);
        showSuccess(toastMessages.urlShortened);
      }
    } catch (error: any) {
      if (!error.isOperational) {
        console.error("Unexpected error:", error);
      }
      showError(error.message || toastMessages.shortenFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (textToCopy: string = shortUrl) => {
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        showSuccess(toastMessages.copied);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        // Clipboard errors are expected (permission issues, etc.)
        showError(toastMessages.copyFailed);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUrlSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Hero Content */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Short links, big results
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
          A powerful URL shortener engineered for professionals. Create, share, and track your links with an industrial-grade modern tool.
        </p>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-3xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-md mb-8">
          {/* Input Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com/very/long/url/here"
              className="flex-1 px-6 py-4 text-lg bg-black/50 border border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder-gray-500"
            />
            <button
              onClick={handleUrlSubmit}
              disabled={loading || !url.trim()}
              className="bg-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-indigo-500 transition-all duration-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Shortening...
                </span>
              ) : (
                "Shorten URL"
              )}
            </button>
          </div>

          {/* Result Section */}
          {shortUrl && (
            <div className="mt-6 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                <span>Your Shortened URL is ready</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 w-full bg-black/30 border border-indigo-500/30 rounded-xl px-5 py-3 overflow-x-auto flex items-center justify-between">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium text-lg hover:text-indigo-300 underline-offset-4 hover:underline break-all">
                    {shortUrl}
                  </a>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => handleCopy(shortUrl)} className="flex-1 sm:flex-none bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 whitespace-nowrap active:scale-95 flex items-center justify-center gap-2">
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          Want to track your clicks? <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 ml-1 font-medium transition-colors">View Dashboard &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
