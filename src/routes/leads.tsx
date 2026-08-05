"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Download, LogOut } from "lucide-react";
import { onAuthStateChangedListener, logoutUser } from "@/lib/auth";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt: Date;
}

function LeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (!user) {
        navigate({ to: "/login" });
      } else {
        setIsAuthenticated(true);
        setUserEmail(user.email || "");
        loadLeads();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const leadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        email: doc.data().email,
        telefone: doc.data().telefone,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setLeads(leadsData);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      alert("Nenhuma lead para exportar");
      return;
    }

    const headers = ["Nome", "Email", "Telefone", "Data"];
    const rows = leads.map((lead) => [
      lead.nome,
      lead.email,
      lead.telefone,
      lead.createdAt.toLocaleDateString("pt-BR"),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-navy-deep text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
          <p className="mt-4 text-muted-foreground">Carregando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Leads</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Total: {leads.length} {leads.length === 1 ? "lead" : "leads"}
              {userEmail && <span className="ml-2">• Logado como: {userEmail}</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-teal/80 hover:from-teal/90 hover:to-teal/70 px-6 py-3 font-semibold text-white transition"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 hover:border-white/40 px-6 py-3 font-semibold text-white transition"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-muted-foreground">Nenhuma lead cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-white/10 bg-navy-elevated p-6 hover:border-teal/50 transition"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Nome
                    </p>
                    <p className="mt-1 text-white font-semibold">{lead.nome}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="mt-1 text-teal hover:text-teal/80 transition break-all"
                    >
                      {lead.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Telefone
                    </p>
                    <a
                      href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-teal hover:text-teal/80 transition"
                    >
                      {lead.telefone}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Data
                    </p>
                    <p className="mt-1 text-white/70">
                      {lead.createdAt.toLocaleDateString("pt-BR")}{" "}
                      {lead.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
});
