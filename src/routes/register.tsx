"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { Mail, Lock } from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);
      navigate({ to: "/leads" });
    } catch (err: any) {
      const errorMessage =
        err.code === "auth/email-already-in-use"
          ? "Este email já está registrado"
          : err.code === "auth/invalid-email"
          ? "Email inválido"
          : "Erro ao criar conta. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Criar Conta</h1>
          <p className="mt-2 text-muted-foreground">
            Registre-se para acessar as leads
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-6 rounded-2xl border border-white/10 bg-navy-elevated p-8"
        >
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Mínimo 6 caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-flame to-orange-600 hover:from-flame/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 font-semibold text-white transition"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <button
            onClick={() => navigate({ to: "/login" })}
            className="text-teal hover:text-teal/80 font-medium transition"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});
