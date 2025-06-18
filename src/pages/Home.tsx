import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-5xl font-bold text-green-700">
        Welcome to Lightning ECE!
      </h1>
      <Link to="/login" className="text-blue-500 underline">Go To Login</Link>
    </div>
  );
}