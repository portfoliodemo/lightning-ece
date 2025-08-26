import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";

export default function ChildcareCentreDashboard() {
  const { user } = useAuth();
  const { createRequest, getForCentre } = useRequests();

  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setMyRequests(getForCentre(user.id));
    }
  }, [user, getForCentre]);

  async function handleBookRequest(eceId: string) {
    if (!user) return;
    try {
      setCreatingId(eceId);
      const created = await createRequest(eceId, {
        message: "Requesting to book your services",
        date: new Date().toISOString(),
      });
      setMyRequests((prev) => [created, ...prev]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create request");
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div>
      <h2>Childcare Centre Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {/* Render list of ECEs with Book buttons */}
      {/* Example: */}
      <button onClick={() => handleBookRequest("ece-123")}>
        {creatingId === "ece-123" ? "Booking..." : "Book ECE #123"}
      </button>

      <h3>My Requests</h3>
      <ul>
        {myRequests.map((req) => (
          <li key={req.id}>
            To: {req.eceId} — Status: {req.status}
          </li>
        ))}
      </ul>
    </div>
  );
}


// Early Version pre-dating context
// // src/pages/ChildcareCentreDashboard.tsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ECECard from "../components/ECECard";
// import { getAllEces } from "../services/eces";
// import {
//   createRequest as apiCreateRequest,
//   getRequestsForCentre,
// } from "../services/requests";
// import type { ECEUser } from "../types/ECE";
// import type { EceRequest } from "../types/Request";

// function groupByStatus(reqs: EceRequest[]) {
//   return reqs.reduce<Record<string, EceRequest[]>>((acc, r) => {
//     (acc[r.status] ||= []).push(r);
//     return acc;
//   }, {});
// }

// export default function ChildcareCentreDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

//   const navigate = useNavigate();
//   const [eces, setEces] = useState<ECEUser[]>([]);
//   const [myRequests, setMyRequests] = useState<EceRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [creatingId, setCreatingId] = useState<string | null>(null);

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }
//     if (currentUser.role !== "Childcare Centre") {
//       navigate("/");
//       return;
//     }

//     let alive = true;
//     async function load() {
//       try {
//         setLoading(true);
//         const [eceList, reqs] = await Promise.all([
//           getAllEces(),
//           getRequestsForCentre(currentUser.id),
//         ]);
//         if (!alive) return;
//         setEces(eceList);
//         setMyRequests(reqs);
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

//   const eceNameById = useMemo(() => {
//     const map = new Map<string, string>();
//     eces.forEach((e) => map.set(e.id, e.fullName ?? `${e.firstName} ${e.lastName}`));
//     return map;
//   }, [eces]);

//   async function handleBookRequest(eceId: string) {
//     if (!currentUser) return;
//     try {
//       setCreatingId(eceId);
//       const created = await apiCreateRequest({
//         centreId: currentUser.id,
//         eceId,
//         message: "Requesting to book your services",
//         date: new Date().toISOString(),
//       });
//       setMyRequests((prev) => [created, ...prev]); // optimistic add
//     } catch (e: any) {
//       setError(e?.message ?? "Failed to create request");
//     } finally {
//       setCreatingId(null);
//     }
//   }

//   const grouped = useMemo(() => groupByStatus(myRequests), [myRequests]);

//   if (!currentUser) return null;

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">Childcare Centre Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {error && (
//         <div className="mb-4 w-full max-w-3xl text-red-700 bg-red-100 border border-red-300 p-3 rounded">
//           {error}
//         </div>
//       )}

//       {/* ECE Profiles */}
//       <div className="p-6 bg-white w-full max-w-5xl rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">ECE Profiles</h2>

//         {loading ? (
//           <p className="text-gray-600">Loading ECEs…</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {eces.map((ece) => (
//               <ECECard
//                 key={ece.id}
//                 ece={ece}
//                 onBookRequest={handleBookRequest}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* My Requests (grouped by status) */}
//       <div className="p-6 bg-white w-full max-w-3xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">My Requests</h2>
//         {loading ? (
//           <p className="text-gray-600">Loading requests…</p>
//         ) : Object.keys(grouped).length === 0 ? (
//           <p className="text-gray-600">No requests yet.</p>
//         ) : (
//           ["Pending", "Accepted", "Declined", "Cancelled", "Completed", "Expired"]
//             .filter((s) => grouped[s]?.length)
//             .map((status) => (
//               <div key={status} className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">{status}</h3>
//                 <ul className="space-y-2">
//                   {grouped[status].map((req) => (
//                     <li
//                       key={req.id}
//                       className="p-3 border rounded-md shadow-sm flex items-center justify-between"
//                     >
//                       <div className="space-y-0.5">
//                         <div>
//                           <span className="font-medium">ECE:</span>{" "}
//                           {eceNameById.get(req.eceId) ?? req.eceId}
//                         </div>
//                         {req.message && (
//                           <div className="text-sm text-gray-600 italic">
//                             “{req.message}”
//                           </div>
//                         )}
//                         <div className="text-xs text-gray-500">
//                           Requested on {new Date(req.createdAt).toLocaleString()}
//                         </div>
//                       </div>
//                       {creatingId === req.eceId && req.status === "Pending" && (
//                         <span className="text-xs text-gray-500">sending…</span>
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



// version 3
// // src/pages/Childcare-Centre-Dashboard.tsx
// import { useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import ECECard from "../components/ECECard";
// import { mockEces } from "../data/mockEces";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest, RequestStatus } from "../types/Request";

// export default function ChildcareCentreDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();
//   const { createRequest, getForCentre } = useRequests();

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!currentUser) navigate("/login");
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;
//   if (currentUser.role !== "Childcare Centre") {
//     navigate("/");
//     return null;
//   }

//   // Handler for when a centre clicks "Request to Book"
//   const handleBookRequest = (eceId: string) => {
//     createRequest(eceId, {
//       message: "Requesting to book your services",
//       date: new Date().toISOString(),
//     });
//   };

//   // Build a quick map for ECE id -> name
//   const eceNameById = useMemo(() => {
//     const map = new Map<string, string>();
//     for (const e of mockEces) map.set(e.id, e.fullName);
//     return map;
//   }, []);

//   // Fetch this centre's requests
//   const myRequests = getForCentre(currentUser.id);

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
//   };

//   const getECEName = (id: string) => eceNameById.get(id) ?? `ECE ${id}`;

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">Childcare Centre Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {/* Overview */}
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
//         <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
//         <p>This is where you can manage your childcare centre operations.</p>
//       </div>

//       {/* ECE Profiles */}
//       <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">ECE Profiles (Available Educators)</h2>
//         <div className="ece-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mockEces.map((ece) => (
//             <ECECard key={ece.id} ece={ece} onBookRequest={handleBookRequest} />
//           ))}
//         </div>
//       </div>

//       {/* My Requests (grouped) */}
//       <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">My Requests</h2>

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
//                       className="p-3 border rounded-md shadow-sm flex justify-between"
//                     >
//                       <span>
//                         To <strong>{getECEName(req.eceId)}</strong> — {formatWhen(req)}
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
// This is the Childcare Centre Dashboard component for the Lightning ECE application.
// This component allows Childcare Centres to view ECE profiles, manage booking requests, and see their own requests.



// Version 2
// import { useNavigate } from "react-router-dom";
// import ECECard from "../components/ECECard";
// import { mockEces } from "../data/mockEces";
// import { useRequests } from "../context/RequestsContext";
// import type { RequestStatus } from "../types/Request";

// export default function ChildcareCentreDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();
//   const { createRequest, getForCentre } = useRequests();

//   if (!currentUser) {
//     navigate("/login");
//     return null;
//   }

//   // Handler for when a centre clicks "Request to Book"
//   const handleBookRequest = (eceId: string) => {
//     if (!currentUser || currentUser.role !== "Childcare Centre") {
//       throw new Error("Only Childcare Centre users can create requests.");
//     }
//     createRequest(eceId, {
//       message: "Requesting to book your services",
//       date: new Date().toISOString(),
//     });
//   };

//   // Retrieve this centre's requests from context
//   const myRequests = getForCentre(currentUser.id);

//   // All possible request statuses
//   const statuses: RequestStatus[] = [
//     "Pending",
//     "Accepted",
//     "Declined",
//     "Cancelled",
//     "Completed",
//     "Expired",
//   ];

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">
//         Childcare Centre Dashboard
//       </h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {/* Dashboard Overview */}
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
//         <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
//         <p>This is where you can manage your childcare centre operations.</p>
//       </div>

//       {/* ECE Profiles */}
//       <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">
//           ECE Profiles (Available Educators)
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mockEces.map((ece) => (
//             <ECECard
//               key={ece.id}
//               ece={ece}
//               onBookRequest={handleBookRequest}
//             />
//           ))}
//         </div>
//       </div>

//       {/* My Requests grouped by status */}
//       <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">My Requests</h2>
//         {statuses.map((status) => {
//           const requestsForStatus = myRequests.filter(
//             (req) => req.status === status
//           );
//           return (
//             <div key={status} className="mb-6">
//               <h3 className="text-lg font-semibold">{status}</h3>
//               {requestsForStatus.length === 0 ? (
//                 <p className="text-gray-500 italic">No {status} requests.</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {requestsForStatus.map((req) => (
//                     <li
//                       key={req.id}
//                       className="p-3 border rounded-md shadow-sm flex justify-between"
//                     >
//                       <span>
//                         To ECE ID: {req.eceId} (
//                         {new Date(
//                           req.timestamp ?? req.createdAt
//                         ).toLocaleString()}
//                         )
//                       </span>
//                       <span className="italic text-gray-600">{req.status}</span>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// This is the Childcare Centre Dashboard component



// Version 1
// import { useNavigate } from "react-router-dom";
// import ECECard from "../components/ECECard";
// import { mockEces } from "../data/mockEces";
// import { useRequests } from "../context/RequestsContext";

// export default function ChildcareCentreDashboard() {
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   const navigate = useNavigate();
//   const { createRequest, getForCentre } = useRequests();

//   if (!currentUser) {
//     // Redirect to login if no user is logged in
//     navigate("/login");
//     return null;
//   }

//   // Handler for when a centre clicks "Request to Book"
//   const handleBookRequest = (eceId: string) => {
//     if (!currentUser || currentUser.role !== "Childcare Centre") {
//       throw new Error("Only Childcare Centre users can create requests.");
//     }
//     createRequest( eceId, {
//       message: "Requesting to book your services",
//       date: new Date().toISOString(),
//     });
//     // Optionally navigate to a confirmation page or show a success message
//     // navigate("/childcare-centre-dashboard"); // Redirect to the dashboard after booking
//     // alert("Booking request sent successfully!");
//     // You can also update the UI to reflect the new request immediately
//     // For example, you could add the new request to a state variable
//     // or trigger a re-fetch of the requests list.
//     // This is just a placeholder for the actual implementation.
//     //   console.log(`Booking request sent for ECE ID: ${eceId}`);
//     //   alert(`Booking request sent for ECE ID: ${eceId}`);
//   };

//   // Retrieve this centre's requests from context
//   const myRequests = getForCentre(currentUser.id);

//     // const newRequest = createRequest(eceId, {
//     //   message: "Requesting to book your services",
//     //   date: new Date().toISOString(),
//     // });

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-blue-600">Childcare Centre Dashboard</h1>
//       <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
//       <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

//       {/* Add more dashboard content here */}
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
//         <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
//         <p>This is where you can manage your childcare centre operations.</p>
//         {/* Add more dashboard features as needed */}
//       </div>

//             {/* ECE Profiles */}
//             <div className="p-6 bg-white min-h-screen w-full max-w-4xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">
//           ECE Profiles (Available Educators)
//         </h2>
//         <div className="ece-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mockEces.map((ece) => (
//             <ECECard
//               key={ece.id}
//               ece={ece}
//               onBookRequest={handleBookRequest}
//             />
//           ))}
//         </div>
//       </div>

//       {/* My Requests */}
//       <div className="p-6 bg-white w-full max-w-2xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">My Requests</h2>
//         {myRequests.length === 0 ? (
//           <p className="text-gray-600">No requests yet.</p>
//         ) : (
//           <ul className="space-y-2">
//             {myRequests.map((req) => (
//               <li
//                 key={req.id}
//                 className="p-3 border rounded-md shadow-sm flex justify-between"
//               >
//                 <span>
//                   Request to ECE ID: {req.eceId} — Status: {req.status}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* <div className="p-6 bg-gray-50 min-h-screen w-full max-w-2xl mt-8 rounded-md shadow-md">
//         <h2 className="text-xl font-semibold mb-4">ECE Profiles (Available Educators)</h2>
//         <div className="ece-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mockEces.map((ece) => (
//             <ECECard key={ece.email} ece={ece} />
//           ))}
//         </div>
//       </div> */}


//     </div>
//   );
// }