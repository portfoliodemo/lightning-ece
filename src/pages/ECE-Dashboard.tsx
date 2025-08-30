import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";

export default function ECEDashboard() {
  const { user } = useAuth();
  const { getForEce, respond } = useRequests();

  if (!user) return null;

  const requests = getForEce(user.id);

  function handleRespond(requestId: string, action: "Accepted" | "Declined") {
    respond(requestId, action);
  }

  return (
    <div>
      <h2>ECE Dashboard</h2>
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            From: {req.centreName ?? req.centreId} — Status: {req.status}{" "}
            {req.status === "Pending" && (
              <>
                <button onClick={() => handleRespond(req.id, "Accepted")}>
                  Accept
                </button>
                <button onClick={() => handleRespond(req.id, "Declined")}>
                  Deny
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



// Version 2.x
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useRequests } from "../context/RequestsContext";

// export default function ECEDashboard() {
//   const { user } = useAuth();
//   const { getForEce, respond } = useRequests();

//   const [requests, setRequests] = useState<any[]>([]);

//   useEffect(() => {
//     if (user) {
//       setRequests(getForEce(user.id));
//     }
//   }, [user, getForEce]);

//   function handleRespond(requestId: string, action: "Accepted" | "Declined") {
//     respond(requestId, action);
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.id === requestId ? { ...req, status: action } : req
//       )
//     );
//   }

//   return (
//     <div>
//       <h2>ECE Dashboard</h2>
//       <ul>
//         {requests.map((req) => (
//           <li key={req.id}>
//             From: {req.centreId} — Status: {req.status}{" "}
//             {req.status === "Pending" && (
//               <>
//                 <button onClick={() => handleRespond(req.id, "Accepted")}>
//                   Accept
//                 </button>
//                 <button onClick={() => handleRespond(req.id, "Declined")}>
//                   Deny
//                 </button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }





// Previous Version
// // src/pages/ECE-Dashboard.tsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import type { EceRequest } from "../types/Request";
// import { getRequestsForEce, respondToRequest } from "../services/requests";
// import { getAllCentres } from "../services/centres";

// function groupByStatus(reqs: EceRequest[]) {
//   return reqs.reduce<Record<string, EceRequest[]>>((acc, r) => {
//     (acc[r.status] ||= []).push(r);
//     return acc;
//   }, {});
// }

// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   const [requests, setRequests] = useState<EceRequest[]>([]);
//   const [centreNameById, setCentreNameById] = useState<Map<string, string>>(new Map());
//   const [loading, setLoading] = useState(true);
//   const [actioning, setActioning] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Auth guard + load data
//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     if (currentUser.role !== "ECE") {
//       navigate("/");
//       return;
//     }

//     let alive = true;
//     async function load() {
//       try {
//         setLoading(true);
//         const [myReqs, centres] = await Promise.all([
//           getRequestsForEce(currentUser.id),
//           getAllCentres(),
//         ]);
//         if (!alive) return;

//         setRequests(myReqs);
//         const map = new Map<string, string>();
//         centres.forEach((c) => map.set(c.id, c.name));
//         setCentreNameById(map);
//       } catch (e: any) {
//         if (!alive) return;
//         setError(e?.message ?? "Failed to load data");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       alive = false;
//     };
//   }, [currentUser, navigate]);

//   const grouped = useMemo(() => groupByStatus(requests), [requests]);

//   async function handleRespond(id: string, next: "Accepted" | "Declined") {
//     try {
//       setActioning(id);
//       // optimistic update
//       setRequests((prev) =>
//         prev.map((r) => (r.id === id ? { ...r, status: next, updatedAt: new Date().toISOString() } : r))
//       );
//       await respondToRequest(id, next);
//     } catch (e: any) {
//       setError(e?.message ?? "Failed to update request");
//       // rollback? (simplest: reload)
//     } finally {
//       setActioning(null);
//     }
//   }

//   if (!currentUser) return null;

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {error && (
//         <div className="mb-4 w-full max-w-3xl text-red-700 bg-red-100 border border-red-300 p-3 rounded">
//           {error}
//         </div>
//       )}

//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
//         <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

//         {loading ? (
//           <p className="text-gray-600">Loading requests…</p>
//         ) : Object.keys(grouped).length === 0 ? (
//           <p className="text-gray-600">No booking requests yet.</p>
//         ) : (
//           ["Pending", "Accepted", "Declined", "Cancelled", "Completed", "Expired"]
//             .filter((s) => grouped[s]?.length)
//             .map((status) => (
//               <div key={status} className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">{status}</h3>
//                 <ul className="space-y-3">
//                   {grouped[status].map((req) => (
//                     <li
//                       key={req.id}
//                       className="border border-gray-200 rounded-md p-4 shadow-sm bg-gray-50 flex items-center justify-between"
//                     >
//                       <div className="space-y-1">
//                         <div className="text-sm">
//                           <span className="font-semibold">Centre:</span>{" "}
//                           {centreNameById.get(req.centreId) ?? req.centreId}
//                         </div>
//                         {req.message && (
//                           <div className="text-sm italic text-gray-600">“{req.message}”</div>
//                         )}
//                         <div className="text-xs text-gray-500">
//                           Requested on {new Date(req.createdAt).toLocaleString()}
//                         </div>
//                       </div>

//                       {status === "Pending" && (
//                         <div className="flex items-center gap-2">
//                           <button
//                             disabled={actioning === req.id}
//                             onClick={() => handleRespond(req.id, "Accepted")}
//                             className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
//                           >
//                             {actioning === req.id ? "…" : "Accept"}
//                           </button>
//                           <button
//                             disabled={actioning === req.id}
//                             onClick={() => handleRespond(req.id, "Declined")}
//                             className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
//                           >
//                             {actioning === req.id ? "…" : "Decline"}
//                           </button>
//                         </div>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// }