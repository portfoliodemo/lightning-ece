// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"ECE" | "Childcare Centre">("ECE");
  const [centreName, setCentreName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `user_${Date.now()}`;
      const newUser: any =
        role === "Childcare Centre"
          ? {
              id,
              role,
              name: centreName,
              email,
              password,
            }
          : {
              id,
              role,
              fullName: `${firstName} ${lastName}`.trim(),
              firstName,
              lastName,
              email,
              password,
            };

      const success = await registerUser(newUser);

      if (success) {
        navigate("/login");
      } else {
        setError("Signup failed. User may already exist or the server rejected the request.");
      }
    } catch (err) {
      setError("An error occurred during signup.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Role Selection */}
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 mb-2 border rounded">
          <option value="ECE">ECE</option>
          <option value="Childcare Centre">Childcare Centre</option>
        </select>

        {/* Conditional Inputs */}
        {role === "Childcare Centre" && (
          <input
            type="text"
            placeholder="Childcare Centre Name"
            value={centreName}
            onChange={(e) => setCentreName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
        )}

        {role === "ECE" && (
          <>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" required />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
      </form>
    </div>
  );
}