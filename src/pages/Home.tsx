import { Link } from "react-router-dom";
import { Zap } from "lucide-react"; 

export default function Home() {
  return (
    <div>
      <h1>
        Welcome to Lightning <Zap /> ECE!
      </h1>
      <section>
        <h2>Connecting Daycares with Early Childhood Educators since 2025!</h2>
      </section>
      <div className="home-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}