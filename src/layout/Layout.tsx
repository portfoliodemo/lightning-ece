import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}
// This Layout component serves as a wrapper for the main content of the application.
// It includes a Navbar at the top and uses the Outlet component from React Router to render nested routes.