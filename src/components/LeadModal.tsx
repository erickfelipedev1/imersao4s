"use client";

import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function LeadModal() {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsOpen(true);
  }, []);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: new Date(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-navy-elevated p-8 shadow-2xl border border-white/10">
        {!submitted ? (
          <>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Garanta sua vaga
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Preencha seus dados para receber mais informações sobre a Jornada 4S
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-flame to-orange-600 hover:from-flame/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 font-semibold text-white transition mt-6"
              >
                {loading ? "Enviando..." : "Garantir vaga"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-teal/20 p-3">
                <svg
                  className="h-6 w-6 text-teal"
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
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Obrigado!
            </h3>
            <p className="text-sm text-muted-foreground">
              Recebemos seus dados. Você em breve receberá mais informações no seu email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
