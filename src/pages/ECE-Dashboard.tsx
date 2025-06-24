import { useNavigate } from "react-router-dom";

export default function ECEDashboard() {
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
      <h1 className="text-3xl font-bold mb-6 text-blue-600">ECE Dashboard</h1>
      <p className="text-lg mb-4">Hello, {currentUser.fullName}!</p>
      <p className="text-md mb-8">You are logged in as: {currentUser.role}</p>

      {/* Add more dashboard content here */}
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p>This is where you can manage your childcare centre operations.</p>
        {/* Add more dashboard features as needed */}
      </div>
    </div>
  );
}
// This is a simple ECE Dashboard component for Lightning ECE application
// It displays a welcome message and the current user's role