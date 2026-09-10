"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/actions/convertkit";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus("success");
      setMessage("You're in! Check your inbox for Day 1 of The Examined Life.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="bg-slate-900 text-white p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-800 max-w-3xl mx-auto my-12 relative overflow-hidden">
      {/* Decorative element for the premium feel */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Stop Managing. Start Philosophizing.
        </h3>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Join{" "}
          <strong className="text-white">The 5-Day Examined Life Course</strong>
          . A free, intensive email series for ambitious minds to organize their
          trajectory without losing their soul.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "loading" ? "Joining..." : "Begin Day 1"}
          </button>
        </div>

        {status === "success" && (
          <p className="mt-4 text-sm text-green-400 text-center font-medium animate-in fade-in slide-in-from-bottom-2">
            {message}
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400 text-center animate-in fade-in slide-in-from-bottom-2">
            {message}
          </p>
        )}

        <p className="mt-6 text-xs text-slate-500 text-center">
          No spam. Unsubscribe at any time. We respect your inbox.
        </p>
      </form>
    </div>
  );
}
