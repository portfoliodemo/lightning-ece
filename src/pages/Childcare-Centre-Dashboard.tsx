// src/pages/Childcare-Centre-Dashboard.tsx
import { useEffect, useState } from "react";
import { useRequests } from "../context/RequestsContext";
import ECECard from "../components/ECECard";
import { getAllEces } from "../services/eces";
import type { ECEUser } from "../types/ECE";

export default function ChildcareCentreDashboard() {
  const { createRequest } = useRequests();
  const [eces, setEces] = useState<ECEUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllEces();
        setEces(data);
      } catch (err) {
        console.error("Failed to fetch ECEs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleBookRequest(eceId: string) {
    try {
      await createRequest(eceId, {
        message: "We’d like to connect with you.",
        date: new Date().toISOString().slice(0, 10),
      });
      alert("Request sent!");
    } catch (err) {
      console.error("Failed to create request:", err);
    }
  }

  if (loading) return <p>Loading available ECEs...</p>;

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">Childcare Centre Dashboard</h1>
      <p className="mb-2">Select an ECE and request them:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {eces.length === 0 ? (
          <p>No ECEs available.</p>
        ) : (
          eces.map((ece) => (
            <ECECard
              key={ece.id}
              ece={ece}
              onBookRequest={handleBookRequest}
            />
          ))
        )}
      </div>
    </div>
  );
}


// // src/components/ChildcareCentreDashboard.tsx
// import { useEffect, useState } from "react";
// import { useRequests } from "../context/RequestsContext";
// import ECECard from "../components/ECECard";
// import { getAllEces, type ECE } from "../services/eces";

// export default function ChildcareCentreDashboard() {
//   const { createRequest } = useRequests();
//   const [eces, setEces] = useState<ECE[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadEces() {
//       try {
//         const data = await getAllEces();
//         setEces(data);
//       } catch (err) {
//         console.error("Failed to fetch ECEs:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadEces();
//   }, []);

//   const handleBookRequest = async (eceId: string) => {
//     try {
//       await createRequest(eceId, {
//         message: "We’d like to connect with you.",
//         date: new Date().toISOString().slice(0, 10),
//       });
//       alert("Request sent!");
//     } catch (err) {
//       console.error("Failed to create request:", err);
//     }
//   };

//   if (loading) return <p>Loading available ECEs...</p>;

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold">Available ECEs</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {eces.length === 0 ? (
//           <p>No ECEs available.</p>
//         ) : (
//           eces.map((ece) => (
//             <ECECard
//               key={ece.id}
//               ece={ece}
//               onBookRequest={handleBookRequest}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }




// // ChildcareCentreDashboard.tsx

// import { useRequests } from "../context/RequestsContext";
// import { mockEces } from "../data/mockEces";
// // import { Button } from "@/components/ui/button";

// export default function ChildcareCentreDashboard() {
//   const { createRequest } = useRequests();

//   // new async wrapper for requests
//   const handleCreateRequest = async (eceId: string) => {
//     try {
//       const req = await createRequest(eceId, {
//         message: "Need coverage tomorrow at 9AM",
//         date: "2025-08-28",
//       });
//       console.log("Created request:", req);
//       // later: show toast or update UI list
//     } catch (err) {
//       console.error("Failed to create request:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Childcare Centre Dashboard</h1>
//       <p className="mb-2">Select an ECE and request them:</p>
//       <ul className="space-y-2">
//         {mockEces.map((ece) => (
//           <li
//             key={ece.id}
//             className="flex items-center justify-between bg-gray-100 p-2 rounded"
//           >
//             <span>
//               {ece.fullName} ({ece.available ? "Available" : "Unavailable"})
//             </span>
//             {ece.available && (
//               <button
//                 onClick={() => handleCreateRequest(ece.id)}
//                 // size="sm"
//                 // variant="default"
//               >
//                 Request
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// Version 3.x
// import { useAuth } from "../context/AuthContext";
// import { useRequests } from "../context/RequestsContext";

// export default function ChildcareCentreDashboard() {
//   const { user } = useAuth();
//   const { createRequest, getForCentre } = useRequests();

//   if (!user) return null;

//   const myRequests = getForCentre(user.id);

//   async function handleBookRequest(eceId: string) {
//     try {
//       await createRequest(eceId, {
//         message: "Requesting to book your services",
//         date: new Date().toISOString(),
//       });
//     } catch (e: any) {
//       alert(e?.message ?? "Failed to create request");
//     }
//   }

//   return (
//     <div>
//       <h2>Childcare Centre Dashboard</h2>
//       <button onClick={() => handleBookRequest("1")}>
//         Book Alice Johnson
//       </button>

//       <h3>My Requests</h3>
//       <ul>
//         {myRequests.map((req) => (
//           <li key={req.id}>
//             To: {req.eceName ?? req.eceId} — Status: {req.status}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// Version 2.x
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useRequests } from "../context/RequestsContext";

// export default function ChildcareCentreDashboard() {
//   const { user } = useAuth();
//   const { createRequest, getForCentre } = useRequests();

//   const [myRequests, setMyRequests] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [creatingId, setCreatingId] = useState<string | null>(null);

//   useEffect(() => {
//     if (user) {
//       setMyRequests(getForCentre(user.id));
//     }
//   }, [user, getForCentre]);

//   async function handleBookRequest(eceId: string) {
//     if (!user) return;
//     try {
//       setCreatingId(eceId);
//       const created = await createRequest(eceId, {
//         message: "Requesting to book your services",
//         date: new Date().toISOString(),
//       });
//       setMyRequests((prev) => [created, ...prev]);
//     } catch (e: any) {
//       setError(e?.message ?? "Failed to create request");
//     } finally {
//       setCreatingId(null);
//     }
//   }

//   return (
//     <div>
//       <h2>Childcare Centre Dashboard</h2>
//       {error && <p className="error">{error}</p>}
//       {/* Render list of ECEs with Book buttons */}
//       {/* Example: */}
//       <button onClick={() => handleBookRequest("ece-123")}>
//         {creatingId === "ece-123" ? "Booking..." : "Book ECE #123"}
//       </button>

//       <h3>My Requests</h3>
//       <ul>
//         {myRequests.map((req) => (
//           <li key={req.id}>
//             To: {req.eceId} — Status: {req.status}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }