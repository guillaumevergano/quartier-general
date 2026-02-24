"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Identifiants invalides");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-imperial-bg">
      <div className="card-imperial w-full max-w-md">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-imperial-gold mx-auto mb-4" />
          <h1 className="font-display text-3xl text-imperial-gold">Quartier Général</h1>
          <p className="font-subtitle text-imperial-muted mt-2 text-lg italic">
            Centre de Commandement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-imperial-muted mb-1 font-subtitle">
              Identifiant
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-imperial-bg border border-imperial-gold/30 rounded px-4 py-2.5 text-imperial-cream focus:border-imperial-gold focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-imperial-muted mb-1 font-subtitle">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-imperial-bg border border-imperial-gold/30 rounded px-4 py-2.5 text-imperial-cream focus:border-imperial-gold focus:outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-imperial-error text-sm text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-imperial w-full py-3">
            {loading ? "Authentification..." : "Entrer au Quartier Général"}
          </button>
        </form>

        <p className="text-center text-xs text-imperial-muted/50 mt-6 font-subtitle italic">
          « L&apos;ordre est la première loi du Ciel. » — Alexander Pope
        </p>
      </div>
    </div>
  );
}
