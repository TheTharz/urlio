"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };

        checkAuth();
        window.addEventListener("auth-change", checkAuth);
        return () => window.removeEventListener("auth-change", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        router.push("/");
    };

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
                    <div className="hidden md:flex items-center justify-between w-full ml-10">
                        <div className="flex items-baseline space-x-4">
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/"
                                    ? "text-white bg-gray-900"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                Home
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith("/dashboard") || pathname.startsWith("/analytics")
                                        ? "text-white bg-gray-900"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Log Out
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center gap-4">
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
