const SHEETS_BACKUP_URL =
  "https://script.google.com/macros/s/AKfycbx9sLto7775bAJgpE1jWQXSZb82LjnyiJpYkeVedR7nfebwREETMKYH93W_vz2LoxMo/exec";

interface LeadPayload {
  nome: string;
  email: string;
  telefone: string;
}

export async function backupLeadToSheets(data: LeadPayload) {
  await fetch(SHEETS_BACKUP_URL, {
    method: "POST",
    // text/plain evita o preflight CORS que o Apps Script não trata; o corpo continua sendo JSON
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      contact_nome: data.nome,
      contact_email: data.email,
      contact_telefone: data.telefone,
      origem: "Jornada 4S - Landing Page",
    }),
  });
}
