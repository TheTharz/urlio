"use client";
import { ShortUrlRequestDTO } from "@/dtos/ShortUrlRequest.dto";
import { shortenUrl } from "@/services/shorten.service";
import { useState } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";

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
      // Only log unexpected errors (500+ status codes are already logged in api.ts)
      if (!error.isOperational) {
        console.error("Unexpected error:", error);
      }
      showError(error.message || toastMessages.shortenFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      {/* Logo/Brand */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
          URL.io
        </h1>
        <p className="text-gray-400 text-lg">
          Shorten your links in seconds
        </p>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com/very/long/url/here"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 text-black placeholder-gray-400"
            />

            <button
              onClick={handleUrlSubmit}
              disabled={loading || !url.trim()}
              className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transform"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Your shortened URL
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Ready to share
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 overflow-x-auto">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black font-medium text-lg hover:underline"
                  >
                    {shortUrl}
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 whitespace-nowrap active:scale-95 transform"
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="text-white">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Instant URL shortening</p>
          </div>
          <div className="text-white">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Secure</h3>
            <p className="text-gray-400 text-sm">Your data is safe with us</p>
          </div>
          <div className="text-white">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Simple</h3>
            <p className="text-gray-400 text-sm">Easy to use interface</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-gray-500 text-sm">
        © 2026 URL.io - Made with ❤️
      </div>
    </div>
  );
}
