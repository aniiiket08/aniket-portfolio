import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.detail || "Invalid email or password.");
      }

      const data = await res.json();
      // Fetch user details
      const meRes = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userData = await meRes.json();

      login(data.access_token, userData);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "The authentication service could not be reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between p-8 md:p-16">
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Column: Wordmark & Tagline */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-ink">
            Meeting Organizer<sup className="text-xl md:text-2xl font-sans">™</sup>
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-soft max-w-lg">
            Meetings, minuted and followed through.
          </p>
        </div>

        {/* Right Column: Sign-in Form */}
        <div className="lg:col-span-5 bg-surface p-8 border border-rule">
          <h2 className="label text-soft mb-6">Sign In</h2>

          {error && (
            <div className="border-l-2 border-accent pl-3 py-2 mb-6 text-sm text-accent bg-accent-wash">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block label text-soft mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@meetingorganizer.internal"
                className="w-full input-underline"
              />
            </div>

            <div>
              <label className="block label text-soft mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full input-underline"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Helper Seed Hints */}
          <div className="mt-8 pt-6 border-t border-rule text-xs font-mono text-faint space-y-1">
            <p>Seed Accounts (password: password123):</p>
            <p>• admin@meetingorganizer.internal (admin)</p>
            <p>• coordinator@meetingorganizer.internal (coordinator)</p>
            <p>• approver@meetingorganizer.internal (approver)</p>
          </div>
        </div>
      </main>

      {/* Footer Line */}
      <footer className="pt-8 border-t border-rule flex justify-between text-faint label">
        <span>Worklet 4 · Agentic AI Lab</span>
        <span>2026</span>
      </footer>
    </div>
  );
};
