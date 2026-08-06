import { createServerFn } from "@tanstack/react-start";

const CLINT_WEBHOOK_URL =
  "https://functions-api.clint.digital/endpoints/integration/webhook/b9ab7e9d-2b4e-43cf-abb6-b877dae175dc";

interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
}

export const sendLeadToClint = createServerFn({ method: "POST" })
  .validator((data: LeadPayload) => data)
  .handler(async ({ data }) => {
    const response = await fetch(CLINT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact_name: data.nome,
        contact_email: data.email,
        contact_telefone: data.telefone,
        timestamp: new Date().toISOString(),
        origem: "Jornada 4S - Landing Page",
      }),
    });

    if (!response.ok) {
      throw new Error(`Clint respondeu ${response.status}`);
    }
  });
