import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";

export default function ECEDashboard() {
  const { user } = useAuth();
  const { getForEce, respond } = useRequests();

  if (!user) return null;

  const requests = getForEce(user.id);

  const handleRespond = (requestId: string, action: "Accepted" | "Declined") => {
    respond(requestId, action);
  };

  return (
    <div>
      <h2>ECE Dashboard</h2>
      <ul>
        {requests.map((req) => (
          <li
            key={req.id}
            style={{
              marginBottom: "1rem",
              backgroundColor:
                requests.some(
                  (r) =>
                    r.eceId === req.eceId &&
                    r.date === req.date &&
                    r.status !== "Declined" &&
                    r.status !== "Cancelled" &&
                    r.id !== req.id
                )
                  ? "#ffe0e0"
                  : "transparent",
            }}
          >
            <div>
              From: <strong>{req.centreName ?? req.centreId}</strong>
            </div>
            <div>Status: {req.status}</div>
            <div>Message: {req.message}</div>
            <div>Date: {req.date}</div>
            <div>
              Time: {req.startTime && req.endTime ? `${req.startTime} - ${req.endTime}` : "-"}
            </div>
            {req.status === "Pending" && (
              <div>
                <button onClick={() => handleRespond(req.id, "Accepted")}>Accept</button>
                <button onClick={() => handleRespond(req.id, "Declined")}>Decline</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}










// import { useAuth } from "../context/AuthContext";
// import { useRequests } from "../context/RequestsContext";

// export default function ECEDashboard() {
//   const { user } = useAuth();
//   const { getForEce, respond } = useRequests();

//   if (!user) return null;

//   const requests = getForEce(user.id);

//   const handleRespond = async (requestId: string, action: "Accepted" | "Declined") => {
//     await respond(requestId, action);
//   };

//   return (
//     <div>
//       <h2>ECE Dashboard</h2>
//       <ul>
//         {requests.map((req) => (
//           <li
//             key={req.id}
//             style={{
//               marginBottom: "1rem",
//               backgroundColor: req.status === "Pending" ? "#fff3e0" : "transparent",
//             }}
//           >
//             <div>
//               From: <strong>{req.centreName ?? req.centreId}</strong>
//             </div>
//             <div>Status: {req.status}</div>
//             <div>Message: {req.message}</div>
//             {req.date && <div>Date: {req.date}</div>}
//             {req.status === "Pending" && (
//               <div>
//                 <button onClick={() => handleRespond(req.id, "Accepted")}>Accept</button>
//                 <button onClick={() => handleRespond(req.id, "Declined")}>Decline</button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }







// // // src/pages/ECE-Dashboard.tsx
// // import { useAuth } from "../context/AuthContext";
// // import { useRequests } from "../context/RequestsContext";

// // export default function ECEDashboard() {
// //   const { user } = useAuth();
// //   const { getForEce, respond } = useRequests();

// //   if (!user) return <div>Loading ECE dashboard...</div>;

// //   const requests = getForEce(user.id);

// //   // Check for duplicate active request for same date from same centre
// //   const isDuplicateRequest = (requestId: string, reqDate: string | undefined, centreId: string) => {
// //     if (!reqDate) return false;
// //     return requests.some(
// //       (r) =>
// //         r.centreId === centreId &&
// //         r.date === reqDate &&
// //         r.id !== requestId &&
// //         r.status !== "Declined" &&
// //         r.status !== "Cancelled"
// //     );
// //   };

// //   const handleRespond = async (requestId: string, action: "Accepted" | "Declined") => {
// //     try {
// //       await respond(requestId, action);
// //     } catch (err) {
// //       console.error("Error responding to request:", err);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>ECE Dashboard for {user.fullName}</h2>
// //       <ul>
// //         {requests.map((req) => (
// //           <li
// //             key={req.id}
// //             style={{
// //               marginBottom: "1rem",
// //               padding: "0.5rem",
// //               border: "1px solid #ccc",
// //               borderRadius: "4px",
// //               backgroundColor: isDuplicateRequest(req.id, req.date ?? "", req.centreId)
// //                 ? "#ffe0e0"
// //                 : "transparent",
// //             }}
// //           >
// //             <div>
// //               From: <strong>{req.centreName ?? req.centreId}</strong>
// //             </div>
// //             <div>Status: {req.status}</div>
// //             <div>Message: {req.message}</div>
// //             {req.date && <div>Date: {req.date}</div>}
// //             {req.status === "Pending" && (
// //               <div style={{ marginTop: "0.5rem" }}>
// //                 <button onClick={() => handleRespond(req.id, "Accepted")}>Accept</button>
// //                 <button onClick={() => handleRespond(req.id, "Declined")}>Decline</button>
// //               </div>
// //             )}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }





// // // src/pages/ECE-Dashboard.tsx
// // import { useAuth } from "../context/AuthContext";
// // import { useRequests } from "../context/RequestsContext";

// // export default function ECEDashboard() {
// //   const { user } = useAuth();
// //   const { getForEce, respond } = useRequests();

// //   if (!user) return null;

// //   const requests = getForEce(user.id);

// //   function handleRespond(requestId: string, action: "Accepted" | "Declined") {
// //     respond(requestId, action);
// //   }

// //   return (
// //     <div>
// //       <h2>ECE Dashboard</h2>
// //       <ul>
// //         {requests.map((req) => (
// //           <li key={req.id} style={{ marginBottom: "1rem" }}>
// //             <div>
// //               From: <strong>{req.centreName ?? req.centreId}</strong>
// //             </div>
// //             <div>Status: {req.status}</div>
// //             <div>Message: {req.message}</div>
// //             {req.date && <div>Date: {req.date}</div>}
// //             {req.status === "Pending" && (
// //               <div>
// //                 <button onClick={() => handleRespond(req.id, "Accepted")}>
// //                   Accept
// //                 </button>
// //                 <button onClick={() => handleRespond(req.id, "Declined")}>
// //                   Decline
// //                 </button>
// //               </div>
// //             )}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }
