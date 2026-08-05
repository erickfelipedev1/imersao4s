"use client";

import { useState } from "react";

export function LeadModal() {
  const [isOpen, setIsOpen] = useState(true);
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

  const isFormValid = () => {
    return (
      formData.nome.trim().length >= 3 &&
      validateEmail(formData.email) &&
      formData.telefone.replace(/\D/g, "").length >= 10
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Formata a mensagem para WhatsApp
      const message = `Olá! Quero garantir meu ingresso individual para Imersão Jornada 4S e tirar dúvidas sobre o evento.
👤 Nome: ${formData.nome}
📧 Email: ${formData.email}
📱 Tel: ${formData.telefone}`;

      // Codifica a mensagem para URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5513996287673?text=${encodedMessage}`;

      // Mostra mensagem de sucesso
      setSubmitted(true);

      // Redireciona para WhatsApp após 2 segundos
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        setIsOpen(false);
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder-white/40 transition focus:outline-none ${
                    formData.nome && formData.nome.trim().length < 3
                      ? "border-red-500/50 bg-red-500/10 focus:border-red-500 focus:bg-red-500/15"
                      : "border-white/10 bg-white/5 focus:border-teal focus:bg-white/10"
                  }`}
                  placeholder="Seu nome completo"
                />
                {formData.nome && formData.nome.trim().length < 3 && (
                  <p className="text-xs text-red-400 mt-1">Mínimo 3 caracteres</p>
                )}
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder-white/40 transition focus:outline-none ${
                    formData.email && !validateEmail(formData.email)
                      ? "border-red-500/50 bg-red-500/10 focus:border-red-500 focus:bg-red-500/15"
                      : "border-white/10 bg-white/5 focus:border-teal focus:bg-white/10"
                  }`}
                  placeholder="seu@email.com"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-xs text-red-400 mt-1">Email inválido</p>
                )}
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-white placeholder-white/40 transition focus:outline-none ${
                    formData.telefone && formData.telefone.replace(/\D/g, "").length < 10
                      ? "border-red-500/50 bg-red-500/10 focus:border-red-500 focus:bg-red-500/15"
                      : "border-white/10 bg-white/5 focus:border-teal focus:bg-white/10"
                  }`}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                />
                {formData.telefone && formData.telefone.replace(/\D/g, "").length < 10 && (
                  <p className="text-xs text-red-400 mt-1">Telefone incompleto (mínimo 10 dígitos)</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid()}
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
