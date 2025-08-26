// src/pages/ECE-Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { EceRequest } from "../types/Request";
import { getRequestsForEce, respondToRequest } from "../services/requests";
import { getAllCentres } from "../services/centres";

function groupByStatus(reqs: EceRequest[]) {
  return reqs.reduce<Record<string, EceRequest[]>>((acc, r) => {
    (acc[r.status] ||= []).push(r);
    return acc;
  }, {});
}

export default function ECEDashboard() {
  const currentUserJSON = localStorage.getItem("currentUser");
  const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
  const navigate = useNavigate();

  const [requests, setRequests] = useState<EceRequest[]>([]);
  const [centreNameById, setCentreNameById] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth guard + load data
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "ECE") {
      navigate("/");
      return;
    }

    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const [myReqs, centres] = await Promise.all([
          getRequestsForEce(currentUser.id),
          getAllCentres(),
        ]);
        if (!alive) return;

        setRequests(myReqs);
        const map = new Map<string, string>();
        centres.forEach((c) => map.set(c.id, c.name));
        setCentreNameById(map);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load data");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [currentUser, navigate]);

  const grouped = useMemo(() => groupByStatus(requests), [requests]);

  async function handleRespond(id: string, next: "Accepted" | "Declined") {
    try {
      setActioning(id);
      // optimistic update
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: next, updatedAt: new Date().toISOString() } : r))
      );
      await respondToRequest(id, next);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update request");
      // rollback? (simplest: reload)
    } finally {
      setActioning(null);
    }
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
      <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
      <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

      {error && (
        <div className="mb-4 w-full max-w-3xl text-red-700 bg-red-100 border border-red-300 p-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

        {loading ? (
          <p className="text-gray-600">Loading requests…</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-gray-600">No booking requests yet.</p>
        ) : (
          ["Pending", "Accepted", "Declined", "Cancelled", "Completed", "Expired"]
            .filter((s) => grouped[s]?.length)
            .map((status) => (
              <div key={status} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{status}</h3>
                <ul className="space-y-3">
                  {grouped[status].map((req) => (
                    <li
                      key={req.id}
                      className="border border-gray-200 rounded-md p-4 shadow-sm bg-gray-50 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-semibold">Centre:</span>{" "}
                          {centreNameById.get(req.centreId) ?? req.centreId}
                        </div>
                        {req.message && (
                          <div className="text-sm italic text-gray-600">“{req.message}”</div>
                        )}
                        <div className="text-xs text-gray-500">
                          Requested on {new Date(req.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {status === "Pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            disabled={actioning === req.id}
                            onClick={() => handleRespond(req.id, "Accepted")}
                            className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
                          >
                            {actioning === req.id ? "…" : "Accept"}
                          </button>
                          <button
                            disabled={actioning === req.id}
                            onClick={() => handleRespond(req.id, "Declined")}
                            className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                          >
                            {actioning === req.id ? "…" : "Decline"}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
    </div>
  );
}




// Version 4
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import type { EceRequest } from "../types/Request"; // Import the EceRequest type
// import { useRequests } from "../context/RequestsContext";

// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   const { requests: allRequests } = useRequests(); // ✅ get the requests array from context
//   const [requests, setRequests] = useState<EceRequest[]>([]);

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }

//     // Filter only this ECE’s requests
//     const myRequests = allRequests.filter(
//       (req: EceRequest) => req.eceId === currentUser.id
//     );
//     setRequests(myRequests);
//   }, [currentUser, navigate, allRequests]);

//   if (!currentUser) {
//     return null; // Prevent rendering before redirect
//   }

//   // Group requests by status
//   const groupedRequests = requests.reduce<Record<string, EceRequest[]>>(
//     (acc, req) => {
//       if (!acc[req.status]) acc[req.status] = [];
//       acc[req.status].push(req);
//       return acc;
//     },
//     {}
//   );

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
//         <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

//         {Object.keys(groupedRequests).length === 0 ? (
//           <p className="text-gray-600">No booking requests yet.</p>
//         ) : (
//           Object.entries(groupedRequests).map(([status, reqs]) => (
//             <div key={status} className="mb-6">
//               <h3 className="text-lg font-semibold mb-2 text-gray-700">
//                 {status}
//               </h3>
//               <ul className="space-y-3">
//                 {reqs.map((req) => (
//                   <li
//                     key={req.id}
//                     className="border border-gray-200 rounded-md p-4 shadow-sm bg-gray-50"
//                   >
//                     <p className="text-sm text-gray-800">
//                       <span className="font-semibold">Centre:</span>{" "}
//                       {req.centreName || req.centreId}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-semibold">Date:</span>{" "}
//                       {req.date || "Not specified"}
//                     </p>
//                     {req.message && (
//                       <p className="text-sm italic text-gray-500">
//                         "{req.message}"
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-400">
//                       Requested on: {new Date(req.createdAt).toLocaleString()}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


// Version 3
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import type { EceRequest } from "../types/Request"; // Import the EceRequest type
// import { useRequests } from "../context/RequestsContext";


// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   const [requests, setRequests] = useState<EceRequest[]>([]);

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }

//     // Load all requests and filter by this ECE's ID
//     const allRequests = useRequests();
//     const myRequests = allRequests.filter(
//       (req: EceRequest) => req.eceId === currentUser.id
//     );
//     setRequests(myRequests);
//   }, [currentUser, navigate]);

//   if (!currentUser) {
//     return null; // Prevent rendering before redirect
//   }

//   // Group requests by status
//   const groupedRequests = requests.reduce<Record<string, EceRequest[]>>(
//     (acc, req) => {
//       if (!acc[req.status]) acc[req.status] = [];
//       acc[req.status].push(req);
//       return acc;
//     },
//     {}
//   );

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
//         <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

//         {Object.keys(groupedRequests).length === 0 ? (
//           <p className="text-gray-600">No booking requests yet.</p>
//         ) : (
//           Object.entries(groupedRequests).map(([status, reqs]) => (
//             <div key={status} className="mb-6">
//               <h3 className="text-lg font-semibold mb-2 text-gray-700">
//                 {status}
//               </h3>
//               <ul className="space-y-3">
//                 {reqs.map((req) => (
//                   <li
//                     key={req.id}
//                     className="border border-gray-200 rounded-md p-4 shadow-sm bg-gray-50"
//                   >
//                     <p className="text-sm text-gray-800">
//                       <span className="font-semibold">Centre:</span>{" "}
//                       {req.centreName || req.centreId}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <span className="font-semibold">Date:</span>{" "}
//                       {req.date || "Not specified"}
//                     </p>
//                     {req.message && (
//                       <p className="text-sm italic text-gray-500">
//                         "{req.message}"
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-400">
//                       Requested on: {new Date(req.createdAt).toLocaleString()}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// Version 2.x
// // src/pages/ECE-Dashboard.tsx
// import { useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest, RequestStatus } from "../types/Request";

// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   const { requests } = useRequests();

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!currentUser) navigate("/login");
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;
//   if (currentUser.role !== "ECE") {
//     navigate("/");
//     return null;
//   }

//   // Filter only requests that target this ECE
//   const myRequests = useMemo(
//     () => requests.filter((r) => r.eceId === currentUser.id),
//     [requests, currentUser.id]
//   );

//   // Group by status (type-safe)
//   const grouped = useMemo(() => {
//     return myRequests.reduce((acc, r) => {
//       (acc[r.status] ??= []).push(r);
//       return acc;
//     }, {} as Record<RequestStatus, EceRequest[]>);
//   }, [myRequests]);

//   const orderedStatuses: RequestStatus[] = [
//     "Pending",
//     "Accepted",
//     "Declined",
//     "Cancelled",
//     "Completed",
//     "Expired",
//   ];

//   const formatWhen = (req: EceRequest) => {
//     const iso = req.timestamp ?? req.createdAt;
//     return iso ? new Date(iso).toLocaleString() : "";
//     // If TypeScript complains about undefined:
//     // return new Date(iso ?? "").toLocaleString();
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-4xl">
//         <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

//         {orderedStatuses.map((status) => {
//           const list = grouped[status] ?? [];
//           return (
//             <section key={status} className="mb-6">
//               <h3 className="text-lg font-semibold capitalize">{status}</h3>
//               {list.length === 0 ? (
//                 <p className="text-gray-500">No {status.toLowerCase()} requests.</p>
//               ) : (
//                 <ul className="space-y-2 mt-2">
//                   {list.map((req) => (
//                     <li
//                       key={req.id}
//                       className="p-3 border rounded-md bg-gray-50 flex justify-between"
//                     >
//                       <span>
//                         <strong>{req.centreName ?? "Unknown Centre"}</strong>{" "}
//                         requested you ({formatWhen(req)})
//                       </span>
//                       <span className="italic text-gray-600">{req.status}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </section>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// This is the ECE Dashboard component for the Lightning ECE application.
// It displays all requests made to the ECE, grouped by status.
// The ECE can view pending, accepted, declined, etc. requests.



// Version 2
// import React from "react";
// import { useRequests } from "../context/RequestsContext";
// import type { RequestStatus } from "../types/Request";

// /**
//  * Dashboard for Early Childhood Educators (ECEs).
//  * Displays all requests grouped by status, allowing the ECE
//  * to view pending, accepted, declined, etc. requests.
//  */
// const ECEDashboard: React.FC = () => {
//   const { requests } = useRequests();

//   // Dynamically get all valid statuses from the RequestStatus union
//   const statuses: RequestStatus[] = [
//     "Pending",
//     "Accepted",
//     "Declined",
//     "Cancelled",
//     "Completed",
//     "Expired",
//   ];

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">ECE Dashboard</h2>
//       {statuses.map((status) => (
//         <div key={status} className="mb-6">
//           <h3 className="text-lg font-semibold">{status}</h3>
//           <ul className="list-disc ml-6">
//             {requests.filter((req) => req.status === status).length === 0 ? (
//               <li className="text-gray-500 italic">No {status} requests</li>
//             ) : (
//               requests
//                 .filter((req) => req.status === status)
//                 .map((req) => (
//                   <li key={req.id}>
//                     {req.centreName} requested you (
//                     {new Date(req.timestamp ?? req.createdAt).toLocaleString()})
//                   </li>
//                 ))
//             )}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ECEDashboard;






// Version 2
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest } from "../types/Request";

// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   const { requests } = useRequests();

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//     }
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;
//   if (currentUser.role !== "ECE") {
//     navigate("/");
//     return null;
//   }
//   // Retrieve all requests from context
//   // // Filter requests for this ECE
//   // const requestsForMe = requests.filter((req) => req.eceId === currentUser.id);
//   // // Sort requests by timestamp (newest first)
//   // const requests = requestsForMe.sort(
//   //   (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//   // );


//   // Group requests by status
//   const groupedRequests: Record<string, EceRequest[]> = requests.reduce(
//     (acc, req) => {
//       if (!acc[req.status]) acc[req.status] = [];
//       acc[req.status].push(req);
//       return acc;
//     },
//     {} as Record<string, EceRequest[]>
//   );

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-4xl">
//         <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

//         {["pending", "accepted", "declined"].map((status) => (
//           <div key={status} className="mb-6">
//             <h3 className="text-lg font-semibold capitalize">{status}</h3>
//             <ul className="space-y-2">
//               {groupedRequests[status]?.map((req) => (
//                 <li
//                   key={req.id}
//                   className="p-3 border rounded-md bg-gray-50 flex justify-between"
//                 >
//                   <span>
//                   {req.centreName} requested you ({new Date(req.timestamp ?? req.createdAt).toLocaleString()})
//                 )
//                   </span>
//                   <span className="italic text-gray-600">{req.status}</span>
//                 </li>
//               )) || <p className="text-gray-500">No {status} requests.</p>}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// Initial Skeleton
// import { useNavigate } from "react-router-dom";

// export default function ECEDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();

//   if (!currentUser) {
//     // Redirect to login if no user is logged in
//     navigate("/login");
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {/* Add more dashboard content here */}
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
//         <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
//         <p>This is where you can manage your ECE profile and bookings.</p>



//       </div>
//     </div>
//   );
// }
// // This is a simple ECE Dashboard component for Lightning ECE application
// // It displays a welcome message and the current user's role