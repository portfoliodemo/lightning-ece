import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { EceRequest, RequestStatus } from "../types/Request";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "requests";

type RequestsContextType = {
  requests: EceRequest[];
  createRequest: (eceId: string, opts?: { message?: string; date?: string }) => EceRequest;
  respond: (requestId: string, status: Exclude<RequestStatus, "Pending">) => void;
  getForEce: (eceId: string) => EceRequest[];
  getForCentre: (centreId: string) => EceRequest[];
};

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<EceRequest[]>([]);
  const { user } = useAuth();

  // Load from storage
  useEffect(() => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      try {
        setRequests(JSON.parse(json));
      } catch {
        setRequests([]);
      }
    }
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  function createRequest(eceId: string, opts?: { message?: string; date?: string }): EceRequest {
    if (!user || user.role !== "Childcare Centre") {
      throw new Error("Only Childcare Centre users can create requests.");
    }
    const id = (crypto?.randomUUID && crypto.randomUUID()) || `req_${Date.now()}_${Math.random()}`;
    const newReq: EceRequest = {
      id,
      eceId,
      centreId: user.id,
      createdAt: new Date().toISOString(),
      status: "Pending",
      message: opts?.message,
      date: opts?.date,
    };
    setRequests(prev => [newReq, ...prev]);
    return newReq;
  }

  function respond(requestId: string, status: Exclude<RequestStatus, "Pending">) {
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status } : r))
    );
  }

  function getForEce(eceId: string) {
    return requests.filter(r => r.eceId === eceId);
  }

  function getForCentre(centreId: string) {
    return requests.filter(r => r.centreId === centreId);
  }

  const value = useMemo(
    () => ({ requests, createRequest, respond, getForEce, getForCentre }),
    [requests]
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
  return ctx;
}