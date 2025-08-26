import { http } from "./api";
import type { EceRequest, RequestStatus } from "../types/Request";

export async function getRequestsForCentre(centreId: string) {
  // newest first
  return http<EceRequest[]>(
    `/requests?centreId=${encodeURIComponent(centreId)}&_sort=createdAt&_order=desc`
  );
}

export async function getRequestsForEce(eceId: string) {
  return http<EceRequest[]>(
    `/requests?eceId=${encodeURIComponent(eceId)}&_sort=createdAt&_order=desc`
  );
}

export async function createRequest(params: {
  centreId: string;
  eceId: string;
  message?: string;
  date?: string;
}) {
  const payload: EceRequest = {
    id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
    centreId: params.centreId,
    eceId: params.eceId,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: params.message,
    date: params.date,
    // optional denorm fields if you want (safe to omit on the backend)
  };
  return http<EceRequest>("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function respondToRequest(
  id: string,
  status: Exclude<RequestStatus, "Pending">
) {
  return http<EceRequest>(`/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
  });
}

export async function cancelRequest(id: string) {
  return respondToRequest(id, "Cancelled");
}
