import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    const matchedUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!matchedUser) {
      setError("Invalid email or password.");
      return;
    }

    // Save current user session
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    // Redirect to role-based dashboard
    if (matchedUser.role === "Childcare Centre") {
      navigate("/childcare-centre-dashboard");
    } else if (matchedUser.role === "ECE") {
      navigate("/ece-dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Lightning ECE Login</h1>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}