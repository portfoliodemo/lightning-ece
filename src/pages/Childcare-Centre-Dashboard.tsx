import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";
import { getAllEces } from "../services/eces";
import type { EceRequest } from "../types/Request";
import type { BaseUser } from "../types/User";

export default function ChildcareCentreDashboard() {
  const { user } = useAuth();
  const { getForCentre, create, respond, cancel } = useRequests();

  const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Declined" | "Cancelled">("All");
  const [requests, setRequests] = useState<EceRequest[]>([]);
  const [eces, setEces] = useState<BaseUser[]>([]);

  // Load requests for this centre
  useEffect(() => {
    if (user) {
      setRequests(getForCentre(user.id));
    }
  }, [user, getForCentre]);

  // Load all ECEs
  useEffect(() => {
    async function loadEces() {
      try {
        const allEces = await getAllEces();
        setEces(allEces);
      } catch (err) {
        console.error("Failed to fetch ECEs:", err);
      }
    }
    loadEces();
  }, []);

  // Filter requests by status
  const filteredRequests =
    filter === "All" ? requests : requests.filter((req) => req.status === filter);

  // Create new request for an ECE
  const handleSendRequest = async (eceId: string) => {
    if (!user) return;
    try {
      await create({
        eceId,
        message: `Request from ${user.fullName ?? "Centre"}`,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error creating request:", err);
    }
  };

  const handleRespond = async (id: string, status: "Accepted" | "Declined") => {
    try {
      await respond(id, status);
    } catch (err) {
      console.error("Error responding to request:", err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancel(id);
    } catch (err) {
      console.error("Error cancelling request:", err);
    }
  };

  return (
    <div>
      <h1>Childcare Centre Dashboard</h1>

      {/* --- Available ECEs --- */}
      <h2>Available ECEs</h2>
      <ul>
        {eces.map((ece) => (
          <li key={ece.id}>
            {ece.fullName ?? `${ece.firstName} ${ece.lastName}`}
            <button onClick={() => handleSendRequest(ece.id)}>Send Request</button>
          </li>
        ))}
      </ul>

      {/* --- Filters --- */}
      <div style={{ marginTop: "1rem" }}>
        <label>
          Filter Requests:{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {/* --- Requests List --- */}
      <h2 style={{ marginTop: "1rem" }}>Requests ({filter})</h2>
      <ul>
        {filteredRequests.map((req) => (
          <li key={req.id}>
            <strong>{req.eceName ?? req.eceId}</strong>: {req.message} — Status: {req.status}
            {req.status === "Pending" && (
              <>
                <button onClick={() => handleRespond(req.id, "Accepted")}>Accept</button>
                <button onClick={() => handleRespond(req.id, "Declined")}>Decline</button>
              </>
            )}
            <button onClick={() => handleCancel(req.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}





// // src/pages/Childcare-Centre-Dashboard.tsx
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest } from "../types/Request";

// export default function ChildcareCentreDashboard() {
//   const { user } = useAuth();
//   const { getForCentre, create, respond, cancel } = useRequests();

//   const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Declined" | "Cancelled">("All");
//   const [requests, setRequests] = useState<EceRequest[]>([]);

//   // keep requests up to date for this centre
//   useEffect(() => {
//     if (user) {
//       setRequests(getForCentre(user.id));
//     }
//   }, [user, getForCentre]);

//   // filtered list based on selected status
//   const filteredRequests =
//     filter === "All" ? requests : requests.filter((req) => req.status === filter);

//   const handleCreateRequest = async () => {
//     try {
//       await create({
//         eceId: "ece_1", // temporary hardcoded until Step 2
//         message: "Hello ECE!",
//         date: new Date().toISOString().split("T")[0],
//       });
//     } catch (err) {
//       console.error("Error creating request:", err);
//     }
//   };

//   const handleRespond = async (id: string, status: "Accepted" | "Declined") => {
//     try {
//       await respond(id, status);
//     } catch (err) {
//       console.error("Error responding to request:", err);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     try {
//       await cancel(id);
//     } catch (err) {
//       console.error("Error cancelling request:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>Childcare Centre Dashboard</h1>

//       <button onClick={handleCreateRequest}>Create Test Request</button>

//       <div style={{ marginTop: "1rem" }}>
//         <label>
//           Filter Requests:{" "}
//           <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
//             <option value="All">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Accepted">Accepted</option>
//             <option value="Declined">Declined</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//         </label>
//       </div>

//       <h2 style={{ marginTop: "1rem" }}>Requests ({filter})</h2>
//       <ul>
//         {filteredRequests.map((req) => (
//           <li key={req.id}>
//             <strong>{req.eceName ?? req.eceId}</strong>: {req.message} — Status: {req.status}
//             {req.status === "Pending" && (
//               <>
//                 <button onClick={() => handleRespond(req.id, "Accepted")}>Accept</button>
//                 <button onClick={() => handleRespond(req.id, "Declined")}>Decline</button>
//               </>
//             )}
//             <button onClick={() => handleCancel(req.id)}>Cancel</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// // src/pages/Childcare-Centre-Dashboard.tsx
// import { useEffect, useState } from "react";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest } from "../types/Request";

// export default function ChildcareCentreDashboard() {
//   const { requests, create, getByStatus, respond, cancel } = useRequests();
//   const [pendingRequests, setPendingRequests] = useState<EceRequest[]>([]);

//   useEffect(() => {
//     setPendingRequests(getByStatus("Pending"));
//   }, [requests, getByStatus]);

//   const handleCreateRequest = async () => {
//     try {
//       await create({
//         eceId: "ece_1", // example ID
//         message: "Hello ECE!",
//         date: "2025-09-26",
//       });
//     } catch (err) {
//       console.error("Error creating request:", err);
//     }
//   };

//   const handleRespond = async (id: string, status: "Accepted" | "Declined") => {
//     try {
//       await respond(id, status);
//     } catch (err) {
//       console.error("Error responding to request:", err);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     try {
//       await cancel(id);
//     } catch (err) {
//       console.error("Error cancelling request:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>Childcare Centre Dashboard</h1>

//       <button onClick={handleCreateRequest}>Create Test Request</button>

//       <h2>Pending Requests</h2>
//       <ul>
//         {pendingRequests.map((req) => (
//           <li key={req.id} style={{ marginBottom: "1rem" }}>
//             <div>
//               <strong>{req.eceName ?? req.eceId}</strong>
//               {" — "}
//               <span>Status: {req.status}</span>
//             </div>
//             <div>Message: {req.message}</div>
//             {req.date && <div>Date: {req.date}</div>}
//             <div>
//               <button onClick={() => handleRespond(req.id, "Accepted")}>
//                 Accept
//               </button>
//               <button onClick={() => handleRespond(req.id, "Declined")}>
//                 Decline
//               </button>
//               <button onClick={() => handleCancel(req.id)}>Cancel</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// // src/pages/Childcare-Centre-Dashboard.tsx
// import { useEffect, useState } from "react";
// import { useRequests } from "../context/RequestsContext";
// import type { EceRequest } from "../types/Request";

// export default function ChildcareCentreDashboard() {
//   const { requests, create, getByStatus, respond, cancel } = useRequests();
//   const [pendingRequests, setPendingRequests] = useState<EceRequest[]>([]);

//   // keep pending requests up to date
//   useEffect(() => {
//     setPendingRequests(getByStatus("Pending"));
//   }, [requests, getByStatus]);

//   const handleCreateRequest = async () => {
//     try {
//       await create({
//         eceId: "ece-id-123",
//         message: "Hello ECE!",
//         date: "2025-09-26",
//       });
//     } catch (err) {
//       console.error("Error creating request:", err);
//     }
//   };

//   const handleRespond = async (id: string, status: "Accepted" | "Declined") => {
//     try {
//       await respond(id, status);
//     } catch (err) {
//       console.error("Error responding to request:", err);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     try {
//       await cancel(id);
//     } catch (err) {
//       console.error("Error cancelling request:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>Childcare Centre Dashboard</h1>

//       <button onClick={handleCreateRequest}>Create Test Request</button>

//       <h2>Pending Requests</h2>
//       <ul>
//         {pendingRequests.map((req) => (
//           <li key={req.id}>
//             <strong>{req.eceName ?? req.eceId}</strong>: {req.message}
//             <button onClick={() => handleRespond(req.id, "Accepted")}>
//               Accept
//             </button>
//             <button onClick={() => handleRespond(req.id, "Declined")}>
//               Decline
//             </button>
//             <button onClick={() => handleCancel(req.id)}>Cancel</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }