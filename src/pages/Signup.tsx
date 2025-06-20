import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-5xl font-bold text-green-700">
        Signup to Lightning ECE!
      </h1>
      <Link to="/login" className="text-blue-500 underline">Login</Link>
      <Link to="/signup" className="text-blue-400 underline">Signup</Link>
    </div>
  );
}