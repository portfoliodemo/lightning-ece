// src/pages/Childcare-Centre-Dashboard.tsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ECECard from "../components/ECECard";
import { mockEces } from "../data/mockEces";
import { useRequests } from "../context/RequestsContext";
import type { EceRequest, RequestStatus } from "../types/Request";

export default function ChildcareCentreDashboard() {
  const currentUserJSON = localStorage.getItem("currentUser");
  const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
  const navigate = useNavigate();
  const { createRequest, getForCentre } = useRequests();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  if (!currentUser) return null;
  if (currentUser.role !== "Childcare Centre") {
    navigate("/");
    return null;
  }

  // Handler for when a centre clicks "Request to Book"
  const handleBookRequest = (eceId: string) => {
    createRequest(eceId, {
      message: "Requesting to book your services",
      date: new Date().toISOString(),
    });
  };

  // Build a quick map for ECE id -> name
  const eceNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of mockEces) map.set(e.id, e.fullName);
    return map;
  }, []);

  // Fetch this centre's requests
  const myRequests = getForCentre(currentUser.id);

  // Group by status (type-safe)
  const grouped = useMemo(() => {
    return myRequests.reduce((acc, r) => {
      (acc[r.status] ??= []).push(r);
      return acc;
    }, {} as Record<RequestStatus, EceRequest[]>);
  }, [myRequests]);

  const orderedStatuses: RequestStatus[] = [
    "Pending",
    "Accepted",
    "Declined",
    "Cancelled",
    "Completed",
    "Expired",
  ];

  const formatWhen = (req: EceRequest) => {
    const iso = req.timestamp ?? req.createdAt;
    return iso ? new Date(iso).toLocaleString() : "";
  };

  const getECEName = (id: string) => eceNameById.get(id) ?? `ECE ${id}`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Childcare Centre Dashboard</h1>
      <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
      <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

      {/* Overview */}
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p>This is where you can manage your childcare centre operations.</p>
      </div>

      {/* ECE Profiles */}
      <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">ECE Profiles (Available Educators)</h2>
        <div className="ece-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEces.map((ece) => (
            <ECECard key={ece.id} ece={ece} onBookRequest={handleBookRequest} />
          ))}
        </div>
      </div>

      {/* My Requests (grouped) */}
      <div className="p-6 bg-white w-full max-w-4xl mt-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>

        {orderedStatuses.map((status) => {
          const list = grouped[status] ?? [];
          return (
            <section key={status} className="mb-6">
              <h3 className="text-lg font-semibold capitalize">{status}</h3>
              {list.length === 0 ? (
                <p className="text-gray-500">No {status.toLowerCase()} requests.</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {list.map((req) => (
                    <li
                      key={req.id}
                      className="p-3 border rounded-md shadow-sm flex justify-between"
                    >
                      <span>
                        To <strong>{getECEName(req.eceId)}</strong> — {formatWhen(req)}
                      </span>
                      <span className="italic text-gray-600">{req.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
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