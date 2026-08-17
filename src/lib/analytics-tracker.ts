import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const EVENTS_COLLECTION = "analytics_events";
export const PRESENCE_COLLECTION = "analytics_presence";

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId() {
  let id = localStorage.getItem("an_visitor_id");
  if (!id) {
    id = randomId();
    localStorage.setItem("an_visitor_id", id);
  }
  return id;
}

const SESSION_TTL_MS = 30 * 60 * 1000;

/**
 * Sessão única por 30 minutos de inatividade (mesmo critério do Analytics do Lovable).
 * Persistida em localStorage para sobreviver a novas abas/recarregamentos.
 */
function getSession() {
  const now = Date.now();
  const last = Number(localStorage.getItem("an_session_last") || 0);
  let id = localStorage.getItem("an_session_id");
  let isNew = false;

  if (!id || !last || now - last > SESSION_TTL_MS) {
    id = randomId();
    isNew = true;
    localStorage.setItem("an_session_id", id);
  }

  localStorage.setItem("an_session_last", String(now));
  return { id, isNew };
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getSource() {
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return utm.toLowerCase();
  const ref = document.referrer;
  if (!ref) return "Direct";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return "Direct";
    return host;
  } catch {
    return "Direct";
  }
}

/**
 * Registra um pageview e mantém um "heartbeat" de presença enquanto a aba está aberta.
 * Retorna a função de cleanup.
 */
export function startTracking(path: string) {
  if (typeof window === "undefined") return () => {};

  const visitorId = getVisitorId();
  const session = getSession();
  const sessionId = session.id;
  const device = getDevice();
  const source = getSource();
  const isNewSession = session.isNew;
  // mantém compatibilidade com o heartbeat de presença
  localStorage.setItem("an_session_last", String(Date.now()));

  void addDoc(collection(db, EVENTS_COLLECTION), {
    type: "pageview",
    path,
    source,
    device,
    visitorId,
    sessionId,
    isNewSession,
    createdAt: serverTimestamp(),
  }).catch((err) => console.error("analytics: falha ao registrar pageview", err));

  const presenceRef = doc(db, PRESENCE_COLLECTION, sessionId);
  const ping = () => {
    localStorage.setItem("an_session_last", String(Date.now()));
    void setDoc(presenceRef, {
      path,
      device,
      source,
      visitorId,
      lastSeen: serverTimestamp(),
    }).catch(() => {});
  };

  ping();
  const interval = window.setInterval(ping, 20000);

  const onHide = () => {
    if (document.visibilityState === "hidden") {
      void deleteDoc(presenceRef).catch(() => {});
    } else {
      ping();
    }
  };
  document.addEventListener("visibilitychange", onHide);

  return () => {
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", onHide);
    void deleteDoc(presenceRef).catch(() => {});
  };
}
