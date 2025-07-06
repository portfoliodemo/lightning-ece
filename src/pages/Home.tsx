import { Link } from "react-router-dom";
import hero from "../assets/images/destination.svg"; // Adjust the path as necessary
// import { Zap } from "lucide-react"; // Uncomment if you want to use the Zap icon

export default function Home() {
  return (
    <div>
      <h1 className="text-blue">Welcome to Lightning ECE</h1>
      {/* <Zap /> */}

      <section>
        <h2>Connecting Early Childhood Educators with Childcare Centres</h2>
      </section>
      <section>
        <figure className="hero-wrapper">
          <img
            src={ hero }
            alt="Lightning ECE Logo"
            className="daycare-logo flex justify-center"
          />
          {/* className="w-32 h-32 mx-auto" //  */}
        </figure>
        {/* <p>
          Lightning ECE is a platform designed to connect early childhood educators with childcare centres, making it easier for both parties to find the right fit.
        </p> */}
      </section>      
      <div className="home-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
      <section className="how-it-works">
        <h2>How Lightning ECE Works</h2>
        <p>
          Lightning ECE connects early childhood educators with childcare centres to solve short-term staffing needs.
        </p>
        <p>
          Whether you're an educator looking for a new opportunity or a childcare centre seeking qualified staff, Lightning ECE simplifies the process of connecting with the right people.
        </p>
      </section>
      {/* <section className="features">
        <h2>Features</h2>
        <p>
          Lightning ECE offers a range of features to enhance the experience for both educators and childcare centres:
        </p>
        <ul>
          <li>Profile creation for educators</li>
          <li>Job postings for childcare centres</li>
          <li>Search functionality to find suitable matches</li>
          <li>Secure messaging between educators and centres</li>
          <li>Easy-to-use interface</li>
        </ul>
      </section> */}
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