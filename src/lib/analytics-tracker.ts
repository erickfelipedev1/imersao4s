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

function getSessionId() {
  let id = sessionStorage.getItem("an_session_id");
  if (!id) {
    id = randomId();
    sessionStorage.setItem("an_session_id", id);
  }
  return id;
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
  const sessionId = getSessionId();
  const device = getDevice();
  const source = getSource();
  const isNewSession = !sessionStorage.getItem("an_session_started");
  sessionStorage.setItem("an_session_started", "1");

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
