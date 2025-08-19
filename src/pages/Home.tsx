import { Link, Navigate } from "react-router-dom";
import hero from "../assets/images/destination.svg";

export default function Home() {
  // Pull user from localStorage
  const currentUserJSON = localStorage.getItem("currentUser");
  const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;

  // Redirect if logged in
  if (currentUser) {
    const roleRoutes: Record<string, string> = {
      "ECE": "/ece-dashboard",
      "Childcare Centre": "/childcare-centre-dashboard",
    };

    const redirectPath = roleRoutes[currentUser.role];
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Otherwise show the home page
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
          Lightning ECE connects early childhood educators with childcare centres to solve short-term staffing needs.
        </p>
        <p>
          Whether you're an educator looking for a new opportunity or a childcare centre seeking qualified staff, Lightning ECE simplifies the process of connecting with the right people.
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


// Previous Home Page before addressing the issue of redirecting logged-in users to their respective dashboards.
// import { Link } from "react-router-dom";
// import hero from "../assets/images/destination.svg"; // Adjust the path as necessary
// // import { Zap } from "lucide-react"; // Uncomment if you want to use the Zap icon

// export default function Home() {

//   // if user is logged in, redirect to dashboard
//   const currentUserJSON = localStorage.getItem("currentUser");
//   const currentUser = currentUserJSON ? JSON.parse(currentUserJSON) : null;
//   if (currentUser) {
//     if (currentUser.role === "ECE") {
//       window.location.href = "/ece-dashboard";
//     } else if (currentUser.role === "Childcare Centre") {
//       window.location.href = "/centre-dashboard";
//     }
//     return null; // Prevent rendering the home page if redirected
//   }
//   // If no user is logged in, render the home page
//   // This is a simple Home component for Lightning ECE application
//   // It displays a welcome message and links to signup and login
//   // It also includes a hero image and a brief description of the application
//   // It is designed to be simple and easy to understand
//   // It is the main entry point for the application
//   // It is the first page that users see when they visit the application
//   // It is a functional component that returns JSX
//   // It uses React Router's Link component to navigate to signup and login pages

//   return (
//     <div>
//       <h1 className="text-blue">Welcome to Lightning ECE</h1>
//       {/* <Zap /> */}

//       <section>
//         <h2>Connecting Early Childhood Educators with Childcare Centres</h2>
//       </section>
//       <section>
//         <figure className="hero-wrapper">
//           <img
//             src={ hero }
//             alt="Lightning ECE Logo"
//             className="daycare-logo flex justify-center"
//           />
//           {/* className="w-32 h-32 mx-auto" //  */}
//         </figure>
//         {/* <p>
//           Lightning ECE is a platform designed to connect early childhood educators with childcare centres, making it easier for both parties to find the right fit.
//         </p> */}
//       </section>      
//       <div className="home-links">
//         <Link to="/signup">Signup</Link>
//         <Link to="/login">Login</Link>
//       </div>
//       <section className="how-it-works">
//         <h2>How Lightning ECE Works</h2>
//         <p>
//           Lightning ECE connects early childhood educators with childcare centres to solve short-term staffing needs.
//         </p>
//         <p>
//           Whether you're an educator looking for a new opportunity or a childcare centre seeking qualified staff, Lightning ECE simplifies the process of connecting with the right people.
//         </p>
//       </section>
//       {/* <section className="features">
//         <h2>Features</h2>
//         <p>
//           Lightning ECE offers a range of features to enhance the experience for both educators and childcare centres:
//         </p>
//         <ul>
//           <li>Profile creation for educators</li>
//           <li>Job postings for childcare centres</li>
//           <li>Search functionality to find suitable matches</li>
//           <li>Secure messaging between educators and centres</li>
//           <li>Easy-to-use interface</li>
//         </ul>
//       </section> */}
//       <section className="get-started">
//         <h2>Get Started!</h2>
//         <p>
//           Ready to connect with early childhood educators or childcare centres?
//         </p>
//         <p>
//           <Link to="/signup">Sign up</Link> or <Link to="/login">log in</Link>!
//         </p>
//       </section>
//       <footer>
//         <p>&copy; 2025 Lightning ECE. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }