"use client";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EVENTS_COLLECTION, PRESENCE_COLLECTION } from "@/lib/analytics-tracker";
import { onAuthStateChangedListener, logoutUser } from "@/lib/auth";
import { LogOut, Users } from "lucide-react";

interface EventRow {
  id: string;
  path: string;
  source: string;
  device: string;
  visitorId: string;
  sessionId: string;
  createdAt: Date;
}

const RANGES = [
  { label: "Hoje", days: 1 },
  { label: "7 dias", days: 7 },
  { label: "14 dias", days: 14 },
  { label: "30 dias", days: 30 },
];

function AnalyticsPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [online, setOnline] = useState(0);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChangedListener((user) => {
      if (!user) {
        navigate({ to: "/login" });
      } else {
        setIsAuthenticated(true);
        setUserEmail(user.email || "");
      }
    });
    return () => unsub();
  }, []);

  // Eventos em tempo real
  useEffect(() => {
    if (!isAuthenticated) return;
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("createdAt", ">=", Timestamp.fromDate(since)),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setEvents(
          snap.docs.map((d) => {
            const data = d.data() as Record<string, unknown>;
            return {
              id: d.id,
              path: (data["path"] as string) || "/",
              source: (data["source"] as string) || "Direct",
              device: (data["device"] as string) || "desktop",
              visitorId: (data["visitorId"] as string) || d.id,
              sessionId: (data["sessionId"] as string) || d.id,
              createdAt:
                (data["createdAt"] as Timestamp | undefined)?.toDate?.() ?? new Date(),
            };
          }),
        );
        setLoading(false);
      },
      (err) => {
        console.error("analytics: erro no stream de eventos", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [isAuthenticated, days]);

  // Visitantes online em tempo real
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = onSnapshot(collection(db, PRESENCE_COLLECTION), (snap) => {
      const cutoff = Date.now() - 60_000;
      const active = new Set<string>();
      snap.docs.forEach((d) => {
        const data = d.data() as Record<string, unknown>;
        const seen = (data["lastSeen"] as Timestamp | undefined)?.toDate?.().getTime() ?? 0;
        if (seen > cutoff) active.add((data["visitorId"] as string) || d.id);
      });
      setOnline(active.size);
    });
    return () => unsub();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const visitors = new Set(events.map((e) => e.visitorId)).size;
    const pageviews = events.length;
    const sessions = new Set(events.map((e) => e.sessionId)).size;

    const series: { date: string; value: number; visitors: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const dayEvents = events.filter((e) => e.createdAt >= d && e.createdAt < next);
      series.push({
        date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        value: dayEvents.length,
        visitors: new Set(dayEvents.map((e) => e.visitorId)).size,
      });
    }

    const group = (key: keyof EventRow) => {
      const map = new Map<string, number>();
      events.forEach((e) => {
        const k = String(e[key]);
        map.set(k, (map.get(k) || 0) + 1);
      });
      return [...map.entries()].sort((a, b) => b[1] - a[1]);
    };

    return {
      visitors,
      pageviews,
      sessions,
      perVisit: visitors ? Number((pageviews / visitors).toFixed(2)) : 0,
      series,
      sources: group("source"),
      devices: group("device"),
      pages: group("path"),
    };
  }, [events, days]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-deep text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">Analytics</h1>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {online} {online === 1 ? "visitante agora" : "visitantes agora"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Atualização em tempo real{userEmail && ` • ${userEmail}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  days === r.days
                    ? "border-teal bg-teal/20 text-white"
                    : "border-white/15 text-muted-foreground hover:border-white/35"
                }`}
              >
                {r.label}
              </button>
            ))}
            <Link
              to="/leads"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-white/35"
            >
              Leads
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Visitantes" value={stats.visitors} />
          <MetricCard label="Page views" value={stats.pageviews} />
          <MetricCard label="Sessões" value={stats.sessions} />
          <MetricCard label="Views / visitante" value={stats.perVisit} />
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-navy-elevated p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Page views por dia
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : (
            <LineChart data={stats.series} />
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ListCard title="Origem" rows={stats.sources} />
          <ListCard title="Dispositivo" rows={stats.devices} />
          <ListCard title="Página" rows={stats.pages} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-elevated p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function LineChart({ data }: { data: { date: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 100;
  const h = 40;
  const points = data.map((d, i) => {
    const x = data.length === 1 ? w / 2 : (i / (data.length - 1)) * w;
    const y = h - (d.value / max) * h;
    return `${x},${y}`;
  });

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-56 w-full">
        <polyline
          points={`0,${h} ${points.join(" ")} ${w},${h}`}
          fill="var(--teal)"
          fillOpacity="0.18"
          stroke="none"
        />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--flame)"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
        {data.map((d) => (
          <span key={d.date} className="flex-1 text-center">
            {d.date}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListCard({ title, rows }: { title: string; rows: [string, number][] }) {
  const total = rows.reduce((acc, [, v]) => acc + v, 0) || 1;
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-elevated p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
      ) : (
        <div className="space-y-3">
          {rows.slice(0, 8).map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <span className="truncate pr-2">{label}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${(value / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics em tempo real | Jornada 4S" },
      { name: "description", content: "Painel interno de visitantes e page views da landing page Jornada 4S, atualizado em tempo real." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Analytics em tempo real | Jornada 4S" },
      { property: "og:description", content: "Painel interno de visitantes e page views da landing page Jornada 4S." },
    ],
  }),
  component: AnalyticsPage,
});
