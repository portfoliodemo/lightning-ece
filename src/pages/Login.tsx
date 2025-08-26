// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate(user.role === "Childcare Centre" ? "/childcare-centre-dashboard" : "/ece-dashboard");
    }
  }, [user, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password.");
      } else {
        // user will be set in context; redirection handled by useEffect
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again later.");
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
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm" />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Log In</button>
        </form>

        <p className="mt-2 text-center text-sm">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>

        <p className="mt-2 text-sm text-center text-gray-600"><Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password</Link></p>
      </div>
    </div>
  );
}






// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import type { BaseUser } from "../types/User";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login, user } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // If already logged in, redirect to dashboard
//   useEffect(() => {
//     if (user) {
//       navigate(
//         user.role === "Childcare Centre"
//           ? "/childcare-centre-dashboard"
//           : "/ece-dashboard"
//       );
//     }
//   }, [user, navigate]);

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       // Query json-server for a matching user
//       const response = await fetch(
//         `http://localhost:5000/users?email=${encodeURIComponent(
//           email
//         )}&password=${encodeURIComponent(password)}`
//       );

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const users: BaseUser[] = await response.json();

//       if (users.length === 0) {
//         setError("Invalid email or password.");
//         return;
//       }

//       // const matchedUser = users[0];

//       // Erroneous
//       // Update AuthContext (this may also persist in localStorage inside AuthContext)
//       // login(matchedUser);

//       const success = await login(email, password);
//       if (!success) {
//         setError("Login failed. Please try again.");
//         return;
//       }

//       // Reset form fields
//       setEmail("");
//       setPassword("");
//     } catch (err) {
//       console.error(err);
//       setError("Login failed. Please try again later.");
//     }
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
//         <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
//           Lightning ECE Login
//         </h1>
//         {error && (
//           <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
//         )}
//         <form className="login-form" onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
//           >
//             Log In
//           </button>
//         </form>

//         <p className="mt-2 text-center text-sm">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>

//         <p className="mt-2 text-sm text-center text-gray-600">
//           <Link to="/forgot-password" className="text-blue-600 hover:underline">
//             Forgot Password
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }



// Version 1
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useEffect } from "react";
// import type { BaseUser } from "../types/User";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login, user } = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   // If user is already logged in, redirect to dashboard
//   useEffect(() => {
//     if (user) {
//       navigate(user.role === "Childcare Centre" ? "/childcare-centre-dashboard" : "/ece-dashboard");
//     }
//   }, [user, navigate]);

//   function handleLogin(e: React.FormEvent) {
//     e.preventDefault();

//     const usersJSON = localStorage.getItem("users");
//     const users = usersJSON ? JSON.parse(usersJSON) : [];

//     // Check if users array is empty
//     if (!users || users.length === 0) {
//       setError("No users found. Please sign up first.");
//       return;
//     }

//     // Check if user exists with matching email and password
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     const matchedUser = users.find(
//       (u: BaseUser) => u.email === email && u.password === password
//     );

//     if (!matchedUser) {
//       setError("Invalid email or password.");
//       return;
//     }

//     // This handles both localStorage and global state
//     login(matchedUser);

//     // Reset fields after login
//     setEmail('');
//     setPassword(''); 
//     setError('');
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
//         <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Lightning ECE Login</h1>
//         {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
//         <form className="login-form" onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
//           >
//             Log In
//           </button>
//         </form>

//         <p><Link to="/signup">Sign up</Link></p>
//         {/* // Optional: Add a link to reset password */}
//         <p className="mt-2 text-sm text-center text-gray-600">
//           <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password</Link>
//         </p>

//       </div>
//     </div>
//   );
// }