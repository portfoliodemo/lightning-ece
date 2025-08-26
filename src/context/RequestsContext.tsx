
// src/context/RequestsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { EceRequest, RequestStatus } from "../types/Request";
import { useAuth } from "./AuthContext";
// import { mockEces } from "../data/mockEces"; // import ECEs so we can resolve their names
import { getAllEces } from "../services/eces";

const STORAGE_KEY = "requests";

type RequestsContextType = {
  requests: EceRequest[];
  createRequest: (
    eceId: string,
    opts?: { message?: string; date?: string }
  ) => Promise<EceRequest>;
  cancelRequest: (id: string) => void;
  respond: (
    requestId: string,
    status: Exclude<RequestStatus, "Pending">
  ) => void;
  getForEce: (eceId: string) => EceRequest[];
  getForCentre: (centreId: string) => EceRequest[];
};


// Initial RequestsContextType
// type RequestsContextType = {
//   requests: EceRequest[];
//   createRequest: (
//     eceId: string, 
//     opts?: { message?: string; date?: string }
//   ) => Promise<EceRequest>;
//   sendRequest: (request: EceRequest) => void;
//   cancelRequest: (id: string) => void;
//   respond: (requestId: string, status: Exclude<RequestStatus, "Pending">) => void;
//   getForEce: (eceId: string) => EceRequest[];
//   getForCentre: (centreId: string) => EceRequest[];
// };

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<EceRequest[]>([]);
  const { user } = useAuth();

  // 🔹 Load requests from localStorage once on mount
  useEffect(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) setRequests(JSON.parse(json));
    } catch {
      setRequests([]);
    }
  }, []);

  // 🔹 Persist to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  // Add a request (centralized path + duplicate protection)
  const sendRequest = (newRequest: EceRequest) => {
    setRequests((prev) => {
      const duplicate = prev.find(
        (r) =>
          r.eceId === newRequest.eceId &&
          r.centreId === newRequest.centreId &&
          r.status === "Pending" &&
          // If a date is given, same-date + same-centre + same-ece counts as duplicate
          (!newRequest.date || r.date === newRequest.date)
      );
      if (duplicate) return prev;
      return [newRequest, ...prev];
    });
  };

  // Convenience helper for Centres to create a request
  const createRequest = async (
    eceId: string,
    opts?: { message?: string; date?: string }
  ): Promise<EceRequest> => {
    if (!user || user.role !== "Childcare Centre") {
      throw new Error("Only Childcare Centre users can create requests.");
    }

    const id =
      (typeof crypto !== "undefined" &&
        "randomUUID" in crypto &&
        crypto.randomUUID()) ||
      `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const eces = await getAllEces(); // Fetch ECEs from the service
    const ece = eces.find((e) => e.id === eceId);

    // Original mock data approach:
    // Look up ECE name from mockEces so we can display names directly
    // const ece = mockEces.find((e) => e.id === eceId);

    const newReq: EceRequest = {
      id,
      eceId,
      centreId: user.id, // Centre creating the request
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
      message: opts?.message,
      date: opts?.date,

      // Denormalized display fields (for friendlier dashboards)
      centreName: user.fullName,
      eceName: ece?.fullName,
      timestamp: new Date().toISOString(), // alias for createdAt
    };

    sendRequest(newReq);
    return newReq;
  };

  // 🔹 ECE or Centre responds (Accept/Decline/Cancelled/Expired)
  const respond = (requestId: string, status: Exclude<RequestStatus, "Pending">) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      )
    );
  };

  // 🔹 Centre cancels its own request
  const cancelRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Cancelled", updatedAt: new Date().toISOString() } : r
      )
    );
  };

  const getForEce = (eceId: string) => requests.filter((r) => r.eceId === eceId);
  const getForCentre = (centreId: string) => requests.filter((r) => r.centreId === centreId);

  const value = useMemo(
    () => ({
      requests,
      createRequest,
      sendRequest,
      cancelRequest,
      respond,
      getForEce,
      getForCentre,
    }),
    [requests]
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
  return ctx;
}



// Version 1
// // src/context/RequestsContext.tsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import type { EceRequest, RequestStatus } from "../types/Request";
// import { useAuth } from "./AuthContext";

// const STORAGE_KEY = "requests";

// type RequestsContextType = {
//   requests: EceRequest[];
//   createRequest: (eceId: string, opts?: { message?: string; date?: string }) => EceRequest;
//   sendRequest: (request: EceRequest) => void;
//   cancelRequest: (id: string) => void;
//   respond: (requestId: string, status: Exclude<RequestStatus, "Pending">) => void;
//   getForEce: (eceId: string) => EceRequest[];
//   getForCentre: (centreId: string) => EceRequest[];
// };

// const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

// export function RequestsProvider({ children }: { children: React.ReactNode }) {
//   const [requests, setRequests] = useState<EceRequest[]>([]);
//   const { user } = useAuth();

//   // Load from storage once
//   useEffect(() => {
//     try {
//       const json = localStorage.getItem(STORAGE_KEY);
//       if (json) setRequests(JSON.parse(json));
//     } catch {
//       setRequests([]);
//     }
//   }, []);

//   // Persist on change
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
//   }, [requests]);

//   // Add a request (centralized path + duplicate protection)
//   const sendRequest = (newRequest: EceRequest) => {
//     setRequests((prev) => {
//       const duplicate = prev.find(
//         (r) =>
//           r.eceId === newRequest.eceId &&
//           r.centreId === newRequest.centreId &&
//           r.status === "Pending" &&
//           // If a date is given, consider same-date pending a duplicate too
//           (!newRequest.date || r.date === newRequest.date)
//       );
//       if (duplicate) return prev;
//       return [newRequest, ...prev];
//     });
//   };

//   // Convenience helper for Centres to create a request
//   const createRequest = (eceId: string, opts?: { message?: string; date?: string }): EceRequest => {
//     if (!user || user.role !== "Childcare Centre") {
//       throw new Error("Only Childcare Centre users can create requests.");
//     }

//     const id =
//       (typeof crypto !== "undefined" &&
//         "randomUUID" in crypto &&
//         crypto.randomUUID()) ||
//       `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;

//     const newReq: EceRequest = {
//       id,
//       eceId,
//       centreId: user.id, // relies on unified User including id: string
//       createdAt: new Date().toISOString(),
//       status: "Pending",
//       message: opts?.message,
//       date: opts?.date,
//     };

//     sendRequest(newReq);
//     return newReq;
//   };

//   // ECE or Centre responds to a request (Accept/Decline/Cancelled/Expired)
//   const respond = (requestId: string, status: Exclude<RequestStatus, "Pending">) => {
//     setRequests((prev) =>
//       prev.map((r) =>
//         r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
//       )
//     );
//   };

//   // Centre withdraws/cancels its pending request
//   const cancelRequest = (id: string) => {
//     setRequests((prev) =>
//       prev.map((r) =>
//         r.id === id ? { ...r, status: "Cancelled", updatedAt: new Date().toISOString() } : r
//       )
//     );
//   };

//   const getForEce = (eceId: string) => requests.filter((r) => r.eceId === eceId);
//   const getForCentre = (centreId: string) => requests.filter((r) => r.centreId === centreId);

//   const value = useMemo(
//     () => ({
//       requests,
//       createRequest,
//       sendRequest,
//       cancelRequest,
//       respond,
//       getForEce,
//       getForCentre,
//     }),
//     [requests]
//   );

//   return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
// }

// export function useRequests() {
//   const ctx = useContext(RequestsContext);
//   if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
//   return ctx;
// }
