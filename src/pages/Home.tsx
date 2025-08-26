import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/images/destination.svg";

export default function Home() {
  const { user } = useAuth();

  if (user) {
    const roleRoutes: Record<string, string> = {
      ECE: "/ece-dashboard",
      "Childcare Centre": "/childcare-centre-dashboard",
    };

    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return (
    <div>
      <h1 className="text-blue">Welcome to Lightning ECE</h1>

      <section>
        <h2>Connecting Early Childhood Educators with Childcare Centres</h2>
      </section>

      <section>
        <figure className="hero-wrapper">
          <img
            src={hero}
            alt="Lightning ECE Logo"
            className="daycare-logo flex justify-center"
          />
        </figure>
      </section>

      <div className="home-links">
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </div>

      <section className="how-it-works">
        <h2>How Lightning ECE Works</h2>
        <p>
          Lightning ECE connects early childhood educators with childcare
          centres to solve short-term staffing needs.
        </p>
        <p>
          Whether you're an educator looking for a new opportunity or a
          childcare centre seeking qualified staff, Lightning ECE simplifies the
          process of connecting with the right people.
        </p>
      </section>

      <section className="get-started">
        <h2>Get Started!</h2>
        <p>
          Ready to connect with early childhood educators or childcare centres?
        </p>
        <p>
          <Link to="/signup">Sign up</Link> or <Link to="/login">log in</Link>!
        </p>
      </section>

      <footer>
        <p>&copy; 2025 Lightning ECE. All rights reserved.</p>
      </footer>
    </div>
  );
}