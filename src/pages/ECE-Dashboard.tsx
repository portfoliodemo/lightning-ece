import React from "react";
import { useRequests } from "../context/RequestsContext";
import type { RequestStatus } from "../types/Request";

/**
 * Dashboard for Early Childhood Educators (ECEs).
 * Displays all requests grouped by status, allowing the ECE
 * to view pending, accepted, declined, etc. requests.
 */
const ECEDashboard: React.FC = () => {
  const { requests } = useRequests();

  // Dynamically get all valid statuses from the RequestStatus union
  const statuses: RequestStatus[] = [
    "Pending",
    "Accepted",
    "Declined",
    "Cancelled",
    "Completed",
    "Expired",
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">ECE Dashboard</h2>
      {statuses.map((status) => (
        <div key={status} className="mb-6">
          <h3 className="text-lg font-semibold">{status}</h3>
          <ul className="list-disc ml-6">
            {requests.filter((req) => req.status === status).length === 0 ? (
              <li className="text-gray-500 italic">No {status} requests</li>
            ) : (
              requests
                .filter((req) => req.status === status)
                .map((req) => (
                  <li key={req.id}>
                    {req.centreName} requested you (
                    {new Date(req.timestamp ?? req.createdAt).toLocaleString()})
                  </li>
                ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ECEDashboard;






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