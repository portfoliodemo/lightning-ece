import { useEffect, useState, useMemo, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";
import { getAllEces } from "../services/eces";
import type { BaseUser } from "../types/User";

export default function ChildcareCentreDashboard() {
  const { user } = useAuth();
  const { getForCentre, create, cancel } = useRequests();

  if (!user) return <div>Loading dashboard...</div>;

  const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Declined" | "Cancelled">("All");
  const [eces, setEces] = useState<BaseUser[]>([]);

  // Form state
  const [selectedEceId, setSelectedEceId] = useState<string>("");
  const [message, setMessage] = useState<string>(`Request from ${user.fullName}`);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");

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

  // Requests for this centre
  const requests = useMemo(() => getForCentre(user.id), [user.id, getForCentre]);

  const filteredRequests = useMemo(() => {
    return filter === "All" ? requests : requests.filter((r) => r.status === filter);
  }, [filter, requests]);

  // Helper to detect duplicates
  const isDuplicateRequest = (eceId: string, date?: string) => {
    return requests.some(
      (r) =>
        r.eceId === eceId &&
        r.date === date &&
        r.status !== "Declined" &&
        r.status !== "Cancelled"
    );
  };

  // Handlers
  const handleSendRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEceId) return;

    if (isDuplicateRequest(selectedEceId, date)) {
      alert("You already have an active request for this ECE on this date.");
      return;
    }

    const ece = eces.find((e) => e.id === selectedEceId);

    try {
      await create({
        eceId: selectedEceId,
        eceName: ece?.fullName,
        centreName: user.fullName,
        message,
        date,
        startTime,
        endTime,
      });

      // Reset form
      setSelectedEceId("");
      setMessage(`Request from ${user.fullName}`);
      setDate(new Date().toISOString().split("T")[0]);
      setStartTime("09:00");
      setEndTime("17:00");
    } catch (err) {
      console.error("Error creating request:", err);
    }
  };

  // Centres do not need to accept or decline, although cancel would be good?
  // const handleRespond = async (requestId: string, action: "Accepted" | "Declined") => {
  //   try {
  //     await respond(requestId, action);
  //   } catch (err) {
  //     console.error("Error responding to request:", err);
  //   }
  // };

  const handleCancel = async (requestId: string) => {
    try {
      await cancel(requestId);
    } catch (err) {
      console.error("Error cancelling request:", err);
    }
  };

  return (
    <div>
      <h1>Dashboard for {user.fullName}</h1>

      {/* --- Create Request Form --- */}
      <form onSubmit={handleSendRequest} style={{ marginBottom: "20px" }}>
        <label>
          Select ECE:
          <select
            value={selectedEceId}
            onChange={(e) => setSelectedEceId(e.target.value)}
            required
          >
            <option value="">--Choose an ECE--</option>
            {eces.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>

        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>

        <button type="submit">Send Request</button>
      </form>

      {/* --- Filter --- */}
      <div>
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* --- Requests Table --- */}
      <table>
        <thead>
          <tr>
            <th>ECE Name</th>
            <th>Centre Name</th>
            <th>Status</th>
            <th>Message</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((req) => (
            <tr
              key={req.id}
              style={{
                backgroundColor: isDuplicateRequest(req.eceId, req.date) ? "#ffe0e0" : "transparent",
              }}
            >
              <td>{req.eceName ?? req.eceId}</td>
              <td>{req.centreName ?? req.centreId}</td>
              <td
                style={{
                  color:
                    req.status === "Pending"
                      ? "orange"
                      : req.status === "Accepted"
                      ? "green"
                      : req.status === "Declined"
                      ? "red"
                      : "black",
                }}
              >
                {req.status}
              </td>
              <td>{req.message}</td>
              <td>{req.date}</td>
              <td>{req.startTime && req.endTime ? `${req.startTime} - ${req.endTime}` : "-"}</td>
              <td>
                {req.status === "Pending" && (
                  <button disabled>
                    Waiting for ECE response
                  </button>
                )}
                {(req.status === "Pending" || req.status === "Accepted") && (
                  <button onClick={() => handleCancel(req.id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}