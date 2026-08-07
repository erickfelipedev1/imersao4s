"use client";

import { useState } from "react";
import { sendLeadToClint } from "@/lib/clint.server";
import logoIE from "@/assets/international-experience.png.asset.json";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketType?: "individual" | "duplo";
}

export function LeadModal({ isOpen, onClose, ticketType = "individual" }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const isFormValid = () => true;

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

      // Formata a mensagem para WhatsApp
      const message = `Olá! Me chamo ${formData.nome}. Quero garantir meu ingresso ${ticketType} para Imersão Jornada 4S e tirar dúvidas sobre o evento.`;

      // Codifica a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5513996287673?text=${encodedMessage}`;

      // Mostra mensagem de sucesso
      setSubmitted(true);

      // Redireciona para WhatsApp após 2 segundos
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao processar:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all ${
      isOpen ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
    }`}>
      <div className="relative w-full max-w-md rounded-2xl bg-navy-elevated p-8 shadow-2xl border border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {!submitted ? (
          <>
            <img
              src={logoIE.url}
              alt="Imersão International Experience"
              className="mb-5 h-12 w-auto"
            />
            <h2 className="mb-2 text-2xl font-bold text-white">
              Imersão INTERNATIONAL EXPERIENCE
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Informe seus dados para prosseguir
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nome
                </label>
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
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-white mb-2">
                  Telefone
                </label>
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
