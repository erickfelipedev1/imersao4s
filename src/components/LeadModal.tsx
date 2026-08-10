"use client";

import { useState } from "react";
import { sendLeadToClint } from "@/lib/clint.server";
import logoIE from "@/assets/international-experience.png.asset.json";

const SYMPLA_URL = "https://www.sympla.com.br/evento/jornada-4s-international-experience/3534522";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "telefone") {
      finalValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Envia dados para o Clint via server function (evita CORS do fetch direto no navegador)
      try {
        await sendLeadToClint({ data: formData });
      } catch (webhookError) {
        // Log do erro mas continua (não falha o fluxo se o Clint falhar)
        console.error("Webhook falhou:", webhookError);
      }

      window.open(SYMPLA_URL, "_blank");
      onClose();
    } catch (error) {
      console.error("Erro ao processar:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all ${
        isOpen ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-navy-elevated p-8 shadow-2xl border border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img
          src={logoIE.url}
          alt="Imersão International Experience"
          className="mx-auto mb-6 w-full max-w-[19rem] object-contain"
        />
        <h2 className="mb-2 text-2xl font-bold text-white">Imersão INTERNATIONAL EXPERIENCE</h2>
        <p className="mb-6 text-sm text-muted-foreground">Informe seus dados para prosseguir</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-teal focus:bg-white/10 focus:outline-none"
              placeholder="(11) 99999-9999"
              inputMode="tel"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-flame to-orange-600 hover:from-flame/90 hover:to-orange-600/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 font-semibold text-white transition mt-6"
          >
            {loading ? "Enviando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
