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