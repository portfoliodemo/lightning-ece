import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { EceRequest, RequestStatus } from "../types/Request";
import { useAuth } from "./AuthContext";
import {
  getRequestsForCentre,
  getRequestsForEce,
  createRequest,
  respondToRequest,
} from "../services/requests";

type RequestsContextType = {
  requests: EceRequest[];
  refresh: () => Promise<void>;
  getForEce: (eceId: string) => EceRequest[];
  getForCentre: (centreId: string) => EceRequest[];
  create: (params: {
    eceId: string;
    eceName?: string;
    centreName?: string;
    message?: string;
    date?: string;
    startTime?: string;  // <- added
    endTime?: string;    // <- added
  }) => Promise<void>;
  respond: (
    requestId: string,
    action: Exclude<RequestStatus, "Pending">
  ) => Promise<void>;
  cancel: (requestId: string) => Promise<void>;
  getByStatus: (status: RequestStatus) => EceRequest[];
};



// type RequestsContextType = {
//   requests: EceRequest[];
//   refresh: () => Promise<void>;
//   getForEce: (eceId: string) => EceRequest[];
//   getForCentre: (centreId: string) => EceRequest[];
//   create: (params: {
//     eceId: string;
//     eceName?: string;
//     centreName?: string;
//     message?: string;
//     date?: string;
//   }) => Promise<void>;
//   respond: (
//     requestId: string,
//     action: Exclude<RequestStatus, "Pending">
//   ) => Promise<void>;
//   cancel: (requestId: string) => Promise<void>;
//   getByStatus: (status: RequestStatus) => EceRequest[];
// };

const RequestsContext = createContext<RequestsContextType | undefined>(
  undefined
);

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EceRequest[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setRequests([]);
      return;
    }

    try {
      let data: EceRequest[] = [];
      if (user.role === "Childcare Centre") {
        data = await getRequestsForCentre(user.id);
      } else if (user.role === "ECE") {
        data = await getRequestsForEce(user.id);
      }
      // Ensure all requests have eceName and centreName
      data = data.map((r) => ({
        ...r,
        centreName: r.centreName ?? user.fullName,
        eceName: r.eceName ?? "ECE",
      }));
      setRequests(data);
    } catch (err) {
      console.error("Failed to refresh requests:", err);
      setRequests([]);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getForEce = (eceId: string) => requests.filter((r) => r.eceId === eceId);
  const getForCentre = (centreId: string) =>
    requests.filter((r) => r.centreId === centreId);
  const getByStatus = (status: RequestStatus) =>
    requests.filter((r) => r.status === status);

  const create = async (params: {
    eceId: string;
    eceName?: string;
    centreName?: string;
    message?: string;
    date?: string;
    startTime?: string;  // <- added
    endTime?: string;    // <- added
  }) => {
    if (!user || user.role !== "Childcare Centre")
      throw new Error("Only Childcare Centre users can create requests.");
  
    const tempRequest: EceRequest = {
      id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
      centreId: user.id,
      centreName: params.centreName ?? user.fullName,
      eceId: params.eceId,
      eceName: params.eceName,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      message: params.message,
      date: params.date,
      startTime: params.startTime,  // <- added
      endTime: params.endTime,      // <- added
    };
  
    setRequests((prev) => [tempRequest, ...prev]);
  
    try {
      await createRequest({
        centreId: user.id,
        eceId: params.eceId,
        message: params.message,
        date: params.date,
        startTime: params.startTime,
        endTime: params.endTime,
      });
      await refresh();
    } catch (err) {
      console.error("Failed to create request:", err);
      setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
    }
  };
  


  // Early create
  // const create = async (params: {
  //   eceId: string;
  //   eceName?: string;
  //   centreName?: string;
  //   message?: string;
  //   date?: string;
  // }) => {
  //   if (!user || user.role !== "Childcare Centre")
  //     throw new Error("Only Childcare Centre users can create requests.");

  //   const tempRequest: EceRequest = {
  //     id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
  //     centreId: user.id,
  //     centreName: params.centreName ?? user.fullName,
  //     eceId: params.eceId,
  //     eceName: params.eceName ?? "ECE",
  //     status: "Pending",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     message: params.message,
  //     date: params.date,
  //   };

  //   setRequests((prev) => [tempRequest, ...prev]);

  //   try {
  //     await createRequest({
  //       centreId: user.id,
  //       eceId: params.eceId,
  //       message: params.message,
  //       date: params.date,
  //     });
  //     await refresh();
  //   } catch (err) {
  //     console.error("Failed to create request:", err);
  //     setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
  //   }
  // };

  const respond = async (
    requestId: string,
    action: Exclude<RequestStatus, "Pending">
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: action, updatedAt: new Date().toISOString() }
          : r
      )
    );

    try {
      await respondToRequest(requestId, action);
    } catch (err) {
      console.error("Failed to respond to request:", err);
      await refresh();
    }
  };

  const cancel = async (requestId: string) => {
    await respond(requestId, "Cancelled");
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        refresh,
        getForEce,
        getForCentre,
        getByStatus,
        create,
        respond,
        cancel,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context)
    throw new Error("useRequests must be used within a RequestsProvider");
  return context;
};








// // src/context/RequestsContext.tsx
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import type { EceRequest, RequestStatus } from "../types/Request";
// import { useAuth } from "./AuthContext";
// import {
//   getRequestsForCentre,
//   getRequestsForEce,
//   createRequest,
//   respondToRequest,
// } from "../services/requests";

// type RequestsContextType = {
//   requests: EceRequest[];
//   refresh: () => Promise<void>;
//   getForEce: (eceId: string) => EceRequest[];
//   getForCentre: (centreId: string) => EceRequest[];
//   create: (params: {
//     eceId: string;
//     eceName?: string;
//     centreName?: string;
//     message?: string;
//     date?: string;
//   }) => Promise<void>;
//   respond: (
//     requestId: string,
//     action: Exclude<RequestStatus, "Pending">
//   ) => Promise<void>;
//   cancel: (requestId: string) => Promise<void>;
//   getByStatus: (status: RequestStatus) => EceRequest[];
// };

// const RequestsContext = createContext<RequestsContextType | undefined>(
//   undefined
// );

// export function RequestsProvider({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();
//   const [requests, setRequests] = useState<EceRequest[]>([]);

//   const refresh = useCallback(async () => {
//     if (!user) {
//       setRequests([]);
//       return;
//     }

//     try {
//       let data: EceRequest[] = [];
//       if (user.role === "Childcare Centre") {
//         data = await getRequestsForCentre(user.id);
//       } else if (user.role === "ECE") {
//         data = await getRequestsForEce(user.id);
//       }
//       setRequests(data);
//     } catch (err) {
//       console.error("Failed to refresh requests:", err);
//       setRequests([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   const getForEce = (eceId: string) => requests.filter((r) => r.eceId === eceId);
//   const getForCentre = (centreId: string) =>
//     requests.filter((r) => r.centreId === centreId);
//   const getByStatus = (status: RequestStatus) =>
//     requests.filter((r) => r.status === status);

//   const create = async (params: {
//     eceId: string;
//     eceName?: string;
//     centreName?: string;
//     message?: string;
//     date?: string;
//   }) => {
//     if (!user || user.role !== "Childcare Centre")
//       throw new Error("Only Childcare Centre users can create requests.");

//     const tempRequest: EceRequest = {
//       id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
//       centreId: user.id,
//       centreName: params.centreName ?? user.fullName,
//       eceId: params.eceId,
//       eceName: params.eceName,
//       status: "Pending",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       message: params.message,
//       date: params.date,
//     };

//     setRequests((prev) => [tempRequest, ...prev]);

//     try {
//       await createRequest({
//         centreId: user.id,
//         eceId: params.eceId,
//         message: params.message,
//         date: params.date,
//       });
//       await refresh();
//     } catch (err) {
//       console.error("Failed to create request:", err);
//       setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
//     }
//   };

//   const respond = async (
//     requestId: string,
//     action: Exclude<RequestStatus, "Pending">
//   ) => {
//     setRequests((prev) =>
//       prev.map((r) =>
//         r.id === requestId
//           ? { ...r, status: action, updatedAt: new Date().toISOString() }
//           : r
//       )
//     );

//     try {
//       await respondToRequest(requestId, action);
//     } catch (err) {
//       console.error("Failed to respond to request:", err);
//       await refresh();
//     }
//   };

//   const cancel = async (requestId: string) => {
//     await respond(requestId, "Cancelled");
//   };

//   return (
//     <RequestsContext.Provider
//       value={{
//         requests,
//         refresh,
//         getForEce,
//         getForCentre,
//         getByStatus,
//         create,
//         respond,
//         cancel,
//       }}
//     >
//       {children}
//     </RequestsContext.Provider>
//   );
// }

// export const useRequests = () => {
//   const context = useContext(RequestsContext);
//   if (!context)
//     throw new Error("useRequests must be used within a RequestsProvider");
//   return context;
// };





// // // src/context/RequestsContext.tsx
// // import {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useState,
// //   useCallback,
// // } from "react";
// // import type { EceRequest, RequestStatus } from "../types/Request";
// // import { useAuth } from "./AuthContext";
// // import {
// //   getRequestsForCentre,
// //   getRequestsForEce,
// //   createRequest,
// //   respondToRequest,
// // } from "../services/requests";

// // type RequestsContextType = {
// //   requests: EceRequest[];
// //   refresh: () => Promise<void>;
// //   getForEce: (eceId: string) => EceRequest[];
// //   getForCentre: (centreId: string) => EceRequest[];
// //   create: (params: {
// //     eceId: string;
// //     eceName?: string;
// //     centreName?: string;
// //     message?: string;
// //     date?: string;
// //   }) => Promise<void>;
// //   respond: (requestId: string, action: RequestStatus) => Promise<void>;
// //   cancel: (requestId: string) => Promise<void>;
// //   getByStatus: (status: RequestStatus) => EceRequest[];
// // };

// // const RequestsContext = createContext<RequestsContextType | undefined>(
// //   undefined
// // );

// // export function RequestsProvider({ children }: { children: React.ReactNode }) {
// //   const { user } = useAuth();
// //   const [requests, setRequests] = useState<EceRequest[]>([]);

// //   // Fetch fresh requests for the logged-in user
// //   const refresh = useCallback(async () => {
// //     if (!user) {
// //       setRequests([]);
// //       return;
// //     }

// //     try {
// //       let data: EceRequest[] = [];

// //       if (user.role === "Childcare Centre") {
// //         data = await getRequestsForCentre(user.id);
// //       } else if (user.role === "ECE") {
// //         data = await getRequestsForEce(user.id);
// //       }

// //       setRequests(data);
// //     } catch (err) {
// //       console.error("Failed to refresh requests:", err);
// //       setRequests([]);
// //     }
// //   }, [user]);

// //   useEffect(() => {
// //     refresh();
// //   }, [refresh]);

// //   // --- Sync Getters ---
// //   const getForEce = (eceId: string): EceRequest[] =>
// //     requests.filter((r) => r.eceId === eceId);

// //   const getForCentre = (centreId: string): EceRequest[] =>
// //     requests.filter((r) => r.centreId === centreId);

// //   const getByStatus = (status: RequestStatus): EceRequest[] =>
// //     requests.filter((r) => r.status === status);

// //   // --- Mutations ---
// //   const create = async (params: {
// //     eceId: string;
// //     eceName?: string;
// //     centreName?: string;
// //     message?: string;
// //     date?: string;
// //   }) => {
// //     if (!user || user.role !== "Childcare Centre") {
// //       throw new Error("Only Childcare Centre users can create requests.");
// //     }

// //     const tempRequest: EceRequest = {
// //       id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
// //       centreId: user.id,
// //       centreName: params.centreName ?? user.fullName, // Use provided name or fallback
// //       eceId: params.eceId,
// //       eceName: params.eceName,
// //       status: "Pending",
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString(),
// //       message: params.message,
// //       date: params.date,
// //     };

// //     // Optimistically update UI
// //     setRequests((prev) => [tempRequest, ...prev]);

// //     try {
// //       await createRequest({
// //         centreId: user.id,
// //         eceId: params.eceId,
// //         message: params.message,
// //         date: params.date,
// //       });

// //       // Refresh to sync with backend
// //       await refresh();
// //     } catch (err) {
// //       console.error("Failed to create request:", err);
// //       // Rollback UI on failure
// //       setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
// //     }
// //   };

// //   const respond = async (requestId: string, action: RequestStatus) => {
// //     try {
// //       await respondToRequest(requestId, action);
// //       setRequests((prev) =>
// //         prev.map((r) =>
// //           r.id === requestId ? { ...r, status: action, updatedAt: new Date().toISOString() } : r
// //         )
// //       );
// //     } catch (err) {
// //       console.error("Failed to respond to request:", err);
// //     }
// //   };

// //   const cancel = async (requestId: string) => {
// //     await respond(requestId, "Cancelled");
// //   };

// //   return (
// //     <RequestsContext.Provider
// //       value={{
// //         requests,
// //         refresh,
// //         getForEce,
// //         getForCentre,
// //         getByStatus,
// //         create,
// //         respond,
// //         cancel,
// //       }}
// //     >
// //       {children}
// //     </RequestsContext.Provider>
// //   );
// // }

// // // --- Hook for easier usage ---
// // export const useRequests = () => {
// //   const context = useContext(RequestsContext);
// //   if (!context) {
// //     throw new Error("useRequests must be used within a RequestsProvider");
// //   }
// //   return context;
// // };



// // // // // src/context/RequestsContext.tsx
// // // import {
// // //   createContext,
// // //   useContext,
// // //   useEffect,
// // //   useState,
// // //   useCallback,
// // //   useMemo,
// // // } from "react";
// // // import type { EceRequest, RequestStatus } from "../types/Request";
// // // import { useAuth } from "./AuthContext";
// // // import {
// // //   getRequestsForCentre,
// // //   getRequestsForEce,
// // //   createRequest,
// // //   respondToRequest,
// // // } from "../services/requests";

// // // type RequestsContextType = {
// // //   requests: EceRequest[];
// // //   refresh: () => Promise<void>;
// // //   getForEce: (eceId: string) => EceRequest[];
// // //   getForCentre: (centreId: string) => EceRequest[];
// // //   create: (params: { eceId: string; message?: string; date?: string }) => Promise<void>;
// // //   respond: (requestId: string, action: RequestStatus) => Promise<void>;
// // //   cancel: (requestId: string) => Promise<void>;
// // //   getByStatus: (status: RequestStatus) => EceRequest[];
// // // };

// // // const RequestsContext = createContext<RequestsContextType | undefined>(
// // //   undefined
// // // );

// // // export function RequestsProvider({ children }: { children: React.ReactNode }) {
// // //   const { user } = useAuth();
// // //   const [requests, setRequests] = useState<EceRequest[]>([]);

// // //   // Fetch fresh requests for the logged-in user
// // //   const refresh = useCallback(async () => {
// // //     if (!user) {
// // //       setRequests([]);
// // //       return;
// // //     }

// // //     try {
// // //       let data: EceRequest[] = [];

// // //       if (user.role === "Childcare Centre") {
// // //         data = await getRequestsForCentre(user.id);
// // //       } else if (user.role === "ECE") {
// // //         data = await getRequestsForEce(user.id);
// // //       }

// // //       setRequests(data);
// // //     } catch (err) {
// // //       console.error("Failed to refresh requests:", err);
// // //       setRequests([]);
// // //     }
// // //   }, [user]);

// // //   useEffect(() => {
// // //     refresh();
// // //   }, [refresh]);

// // //   // --- Sync Getters (no Promises) ---
// // //   const getForEce = (eceId: string): EceRequest[] =>
// // //     requests.filter((r) => r.eceId === eceId);

// // //   const getForCentre = (centreId: string): EceRequest[] =>
// // //     requests.filter((r) => r.centreId === centreId);

// // //   const getByStatus = (status: RequestStatus): EceRequest[] =>
// // //     requests.filter((r) => r.status === status);

// // //   // --- Mutations ---
// // //   const create = async (params: { eceId: string; eceName?: string; message?: string; date?: string }) => {
// // //     if (!user || user.role !== "Childcare Centre") throw new Error("Only Childcare Centre users can create requests.");
  
// // //     const tempRequest: EceRequest = {
// // //       id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
// // //       centreId: user.id,
// // //       centreName: user.fullName, // <-- add centre name
// // //       eceId: params.eceId,
// // //       eceName: params.eceName,
// // //       status: "Pending",
// // //       createdAt: new Date().toISOString(),
// // //       updatedAt: new Date().toISOString(),
// // //       message: params.message,
// // //       date: params.date,
// // //     };
  
// // //     setRequests((prev) => [tempRequest, ...prev]);
  
// // //     try {
// // //       await createRequest({
// // //         centreId: user.id,
// // //         eceId: params.eceId,
// // //         message: params.message,
// // //         date: params.date,
// // //       });
// // //       await refresh();
// // //     } catch (err) {
// // //       console.error("Failed to create request:", err);
// // //       setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
// // //     }
// // //   };
  
  

// //   // const create = async (params: { eceId: string; message?: string; date?: string }) => {
// //   //   if (!user || user.role !== "Childcare Centre") {
// //   //     throw new Error("Only Childcare Centre users can create requests.");
// //   //   }

// //   //   const tempRequest: EceRequest = {
// //   //     id: crypto.randomUUID?.() ?? `req_${Date.now()}_${Math.random()}`,
// //   //     centreId: user.id,
// //   //     eceId: params.eceId,
// //   //     status: "Pending",
// //   //     createdAt: new Date().toISOString(),
// //   //     updatedAt: new Date().toISOString(),
// //   //     message: params.message,
// //   //     date: params.date,
// //   //   };

// //   //   setRequests((prev) => [tempRequest, ...prev]);

// //   //   try {
// //   //     await createRequest({
// //   //       centreId: user.id,
// //   //       eceId: params.eceId,
// //   //       message: params.message,
// //   //       date: params.date,
// //   //     });
// //   //     await refresh();
// //   //   } catch (err) {
// //   //     console.error("Failed to create request:", err);
// //   //     setRequests((prev) => prev.filter((r) => r.id !== tempRequest.id));
// //   //   }
// //   // };

// // //   const respond = async (requestId: string, action: RequestStatus) => {
// // //     setRequests((prev) =>
// // //       prev.map((r) =>
// // //         r.id === requestId
// // //           ? { ...r, status: action, updatedAt: new Date().toISOString() }
// // //           : r
// // //       )
// // //     );

// // //     try {
// // //       await respondToRequest(requestId, action as Exclude<RequestStatus, "Pending">);
// // //     } catch (err) {
// // //       console.error("Failed to respond to request:", err);
// // //       await refresh();
// // //     }
// // //   };

// // //   const cancel = async (requestId: string) => {
// // //     setRequests((prev) =>
// // //       prev.map((r) =>
// // //         r.id === requestId
// // //           ? { ...r, status: "Cancelled", updatedAt: new Date().toISOString() }
// // //           : r
// // //       )
// // //     );

// // //     try {
// // //       await respondToRequest(requestId, "Cancelled");
// // //     } catch (err) {
// // //       console.error("Failed to cancel request:", err);
// // //       await refresh();
// // //     }
// // //   };

// // //   const value = useMemo(
// // //     () => ({
// // //       requests,
// // //       refresh,
// // //       getForEce,
// // //       getForCentre,
// // //       create,
// // //       respond,
// // //       cancel,
// // //       getByStatus,
// // //     }),
// // //     [requests, refresh]
// // //   );

// // //   return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
// // // }

// // // export function useRequests(): RequestsContextType {
// // //   const ctx = useContext(RequestsContext);
// // //   if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
// // //   return ctx;
// // // }