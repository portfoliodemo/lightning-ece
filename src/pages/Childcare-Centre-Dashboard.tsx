import { useNavigate } from "react-router-dom";
import ECECard from "../components/ECECard";
import { mockEces } from "../data/mockEces";

export default function ChildcareCentreDashboard() {
  const currentUserJSON = localStorage.getItem("currentUser");
  const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
  const navigate = useNavigate();

  if (!currentUser) {
    // Redirect to login if no user is logged in
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Childcare Centre Dashboard</h1>
      <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
      <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

      {/* Add more dashboard content here */}
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p>This is where you can manage your childcare centre operations.</p>
        {/* Add more dashboard features as needed */}
      </div>

      <div className="p-6 bg-gray-50 min-h-screen w-full max-w-2xl mt-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">ECE Profiles (Available Educators)</h2>
        <div className="ece-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEces.map((ece) => (
            <ECECard key={ece.email} ece={ece} />
          ))}
        </div>
      </div>
    </div>
  );
}