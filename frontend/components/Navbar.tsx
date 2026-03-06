"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tight text-white hover:text-gray-200 transition-colors">
                                URL.io
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/"
                                        ? "text-white bg-gray-900"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith("/dashboard") || pathname.startsWith("/analytics")
                                        ? "text-white bg-gray-900"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        {/* Mobile menu logic could be added here, keeping simple for now */}
                        <Link
                            href="/dashboard"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
