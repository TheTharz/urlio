"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.service";
import { showSuccess, showError } from "@/lib/toast";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { token, user } = await login({ email, password });

            // Store token securely
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // We will dispatch a storage event or use context later to update Navbar
            window.dispatchEvent(new Event("auth-change"));

            showSuccess("Welcome back!");
            router.push("/dashboard");
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to login. Please check your credentials.");
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-vh-[calc(100vh-64px)] px-4 py-16">
            <div className="w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to manage your shortened links.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white placeholder-gray-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-indigo-500 transition-all duration-200 disabled:bg-gray-800 disabled:text-gray-500 flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
