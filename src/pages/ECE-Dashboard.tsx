// src/pages/ECE-Dashboard.tsx
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
          <li key={req.id} style={{ marginBottom: "1rem" }}>
            <div>
              From: <strong>{req.centreName ?? req.centreId}</strong>
            </div>
            <div>Status: {req.status}</div>
            <div>Message: {req.message}</div>
            {req.date && <div>Date: {req.date}</div>}
            {req.status === "Pending" && (
              <div>
                <button onClick={() => handleRespond(req.id, "Accepted")}>
                  Accept
                </button>
                <button onClick={() => handleRespond(req.id, "Declined")}>
                  Decline
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
