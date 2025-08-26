// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState<"ECE" | "Childcare Centre">("ECE");
  const [centreName, setCentreName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `user_${Date.now()}`;
      const newUser: any =
        role === "Childcare Centre"
          ? {
              id,
              role,
              name: centreName,
              email,
              password,
            }
          : {
              id,
              role,
              fullName: `${firstName} ${lastName}`.trim(),
              firstName,
              lastName,
              email,
              password,
            };

      const success = await registerUser(newUser);

      if (success) {
        navigate("/login");
      } else {
        setError("Signup failed. User may already exist or the server rejected the request.");
      }
    } catch (err) {
      setError("An error occurred during signup.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Role Selection */}
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 mb-2 border rounded">
          <option value="ECE">ECE</option>
          <option value="Childcare Centre">Childcare Centre</option>
        </select>

        {/* Conditional Inputs */}
        {role === "Childcare Centre" && (
          <input
            type="text"
            placeholder="Childcare Centre Name"
            value={centreName}
            onChange={(e) => setCentreName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            required
          />
        )}

        {role === "ECE" && (
          <>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 mb-2 border rounded" required />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" required />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
      </form>
    </div>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/api";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [role, setRole] = useState("ECE");
//   const [centreName, setCentreName] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const newUser = {
//         id: crypto.randomUUID(),
//         role,
//         name: role === "ChildcareCentre" ? centreName : undefined,
//         firstName,
//         lastName,
//         email,
//         password,
//       };

//       const success = await registerUser(newUser);

//       if (success) {
//         navigate("/login");
//       } else {
//         setError("Signup failed. User may already exist.");
//       }
//     } catch (err) {
//       setError("An error occurred during signup.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//       >
//         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

//         {error && <p className="text-red-500 mb-2">{error}</p>}

//         {/* Role Selection */}
//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full p-2 mb-2 border rounded"
//         >
//           <option value="ECE">ECE</option>
//           <option value="Childcare Centre">Childcare Centre</option>
//         </select>

//         {/* Conditional Inputs */}
//         {role === "ChildcareCentre" && (
//           <input
//             type="text"
//             placeholder="Childcare Centre Name"
//             value={centreName}
//             onChange={(e) => setCentreName(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//             required
//           />
//         )}

//         <input
//           type="text"
//           placeholder="First Name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />

//         <input
//           type="text"
//           placeholder="Last Name"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-2 border rounded"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border rounded"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }


// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { registerUser } from "../services/api";

// // export default function Signup() {
// //   const navigate = useNavigate();

// //   const [role, setRole] = useState("ECE");
// //   const [centreName, setCentreName] = useState("");
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");

// //     try {
// //       const newUser = {
// //         id: crypto.randomUUID(),
// //         role,
// //         centreName: role === "ChildcareCentre" ? centreName : undefined,
// //         firstName,
// //         lastName,
// //         email,
// //         password,
// //       };

// //       const success = await registerUser(newUser);

// //       if (success) {
// //         navigate("/login");
// //       } else {
// //         setError("Signup failed. User may already exist.");
// //       }
// //     } catch (err) {
// //       setError("An error occurred during signup.");
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <div className="flex justify-center items-center min-h-screen">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="bg-white p-6 rounded shadow-md w-80"
// //       >
// //         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

// //         {error && <p className="text-red-500 mb-2">{error}</p>}

// //         {/* Role Selection */}
// //         <select
// //           value={role}
// //           onChange={(e) => setRole(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //         >
// //           <option value="ECE">ECE</option>
// //           <option value="ChildcareCentre">Childcare Centre</option>
// //         </select>

// //         {/* Conditional Inputs */}
// //         {role === "ChildcareCentre" && (
// //           <input
// //             type="text"
// //             placeholder="Childcare Centre Name"
// //             value={centreName}
// //             onChange={(e) => setCentreName(e.target.value)}
// //             className="w-full p-2 mb-2 border rounded"
// //             required
// //           />
// //         )}

// //         <input
// //           type="text"
// //           placeholder="First Name"
// //           value={firstName}
// //           onChange={(e) => setFirstName(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         <input
// //           type="text"
// //           placeholder="Last Name"
// //           value={lastName}
// //           onChange={(e) => setLastName(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           className="w-full p-2 mb-4 border rounded"
// //           required
// //         />

// //         <button
// //           type="submit"
// //           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //         >
// //           Sign Up
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }




// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { registerUser } from "../services/api";

// // export default function Signup() {
// //   const navigate = useNavigate();

// //   // we track firstName + lastName separately
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");

// //     try {
// //       // combine into one object matching your User type
// //       const newUser = {
// //         id: crypto.randomUUID(), // quick unique id
// //         firstName,
// //         lastName,
// //         email,
// //         password,
// //         role: "client", // default role for new signups
// //       };

// //       const success = await registerUser(newUser);

// //       if (success) {
// //         navigate("/login"); // redirect after successful signup
// //       } else {
// //         setError("Signup failed. User may already exist.");
// //       }
// //     } catch (err) {
// //       setError("An error occurred during signup.");
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <div className="flex justify-center items-center min-h-screen">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="bg-white p-6 rounded shadow-md w-80"
// //       >
// //         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

// //         {error && <p className="text-red-500 mb-2">{error}</p>}

// //         {/* First Name */}
// //         <input
// //           type="text"
// //           placeholder="First Name"
// //           value={firstName}
// //           onChange={(e) => setFirstName(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         {/* Last Name */}
// //         <input
// //           type="text"
// //           placeholder="Last Name"
// //           value={lastName}
// //           onChange={(e) => setLastName(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         {/* Email */}
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           className="w-full p-2 mb-2 border rounded"
// //           required
// //         />

// //         {/* Password */}
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           className="w-full p-2 mb-4 border rounded"
// //           required
// //         />

// //         <button
// //           type="submit"
// //           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
// //         >
// //           Sign Up
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }


// // // import { useState } from "react";
// // // import { useAuth } from "../context/AuthContext";

// // // export default function Signup() {
// // //   const { login } = useAuth();
// // //   const [role, setRole] = useState<"ECE" | "Childcare Centre">("ECE");
// // //   const [firstName, setFirstName] = useState("");
// // //   const [lastName, setLastName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   async function handleSubmit(e: React.FormEvent) {
// // //     e.preventDefault();

// // //     // Build user object
// // //     const newUser = {
// // //       id: crypto.randomUUID(),
// // //       firstName,
// // //       lastName,
// // //       email,
// // //       password,
// // //     };

// // //     // POST to correct collection (eces or centres)
// // //     const response = await fetch(
// // //       `http://localhost:3000/${role === "ECE" ? "eces" : "centres"}`,
// // //       {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(newUser),
// // //       }
// // //     );

// // //     if (response.ok) {
// // //       const savedUser = await response.json();
// // //       // FIX: login requires both user and role
// // //       login(savedUser, role);
// // //     } else {
// // //       console.error("Signup failed");
// // //     }
// // //   }

// // //   return (
// // //     <form onSubmit={handleSubmit}>
// // //       <label>
// // //         Role:
// // //         <select value={role} onChange={(e) => setRole(e.target.value as any)}>
// // //           <option value="ECE">ECE</option>
// // //           <option value="Childcare Centre">Childcare Centre</option>
// // //         </select>
// // //       </label>

// // //       <label>
// // //         First Name:
// // //         <input
// // //           type="text"
// // //           placeholder="First Name"
// // //           value={firstName}
// // //           onChange={(e) => setFirstName(e.target.value)}
// // //           required
// // //         />
// // //       </label>

// // //       <label>
// // //         Last Name:
// // //         <input
// // //           type="text"
// // //           placeholder="Last Name"
// // //           value={lastName}
// // //           onChange={(e) => setLastName(e.target.value)}
// // //           required
// // //         />
// // //       </label>

// // //       <label>
// // //         Email:
// // //         <input
// // //           type="email"
// // //           placeholder="Email"
// // //           value={email}
// // //           onChange={(e) => setEmail(e.target.value)}
// // //           required
// // //         />
// // //       </label>

// // //       <label>
// // //         Password:
// // //         <input
// // //           type="password"
// // //           placeholder="Password"
// // //           value={password}
// // //           onChange={(e) => setPassword(e.target.value)}
// // //           required
// // //         />
// // //       </label>

// // //       <button type="submit">Sign Up</button>
// // //     </form>
// // //   );
// // // }


// // // Version 2
// // // import { useState } from "react";
// // // import { useAuth } from "../context/AuthContext";

// // // export default function Signup() {
// // //   const { login } = useAuth();
// // //   const [role, setRole] = useState<"ECE" | "Childcare Centre">("ECE");
// // //   const [firstName, setFirstName] = useState("");
// // //   const [lastName, setLastName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   async function handleSubmit(e: React.FormEvent) {
// // //     e.preventDefault();

// // //     // Build user object
// // //     const newUser = {
// // //       id: crypto.randomUUID(),
// // //       firstName,
// // //       lastName,
// // //       email,
// // //       password,
// // //       role,
// // //     };

// // //     // Save to db.json via json-server (POST)
// // //     const response = await fetch(
// // //       `http://localhost:3000/${role === "ECE" ? "eces" : "centres"}`,
// // //       {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(newUser),
// // //       }
// // //     );

// // //     if (response.ok) {
// // //       const savedUser = await response.json();
// // //       login(savedUser); // logs them in immediately
// // //     } else {
// // //       console.error("Signup failed");
// // //     }
// // //   }

// // //   return (
// // //     <form onSubmit={handleSubmit}>
// // //       <select value={role} onChange={(e) => setRole(e.target.value as any)}>
// // //         <option value="ECE">ECE</option>
// // //         <option value="Childcare Centre">Childcare Centre</option>
// // //       </select>

// // //       <input
// // //         type="text"
// // //         placeholder="First Name"
// // //         value={firstName}
// // //         onChange={(e) => setFirstName(e.target.value)}
// // //         required
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Last Name"
// // //         value={lastName}
// // //         onChange={(e) => setLastName(e.target.value)}
// // //         required
// // //       />
// // //       <input
// // //         type="email"
// // //         placeholder="Email"
// // //         value={email}
// // //         onChange={(e) => setEmail(e.target.value)}
// // //         required
// // //       />
// // //       <input
// // //         type="password"
// // //         placeholder="Password"
// // //         value={password}
// // //         onChange={(e) => setPassword(e.target.value)}
// // //         required
// // //       />

// // //       <button type="submit">Sign Up</button>
// // //     </form>
// // //   );
// // // }

// // // import { Link, useNavigate } from "react-router-dom";
// // // import { useState, useEffect } from "react";
// // // import { useAuth } from "../context/AuthContext";
// // // import type { BaseUser } from "../types/User";

// // // export default function Signup() {
// // //   const { user } = useAuth();
// // //   const navigate = useNavigate();

// // //   const [fullName, setFullName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [role, setRole] = useState<"ECE" | "Childcare Centre">("ECE");
// // //   const [error, setError] = useState("");

// // //   // Redirect if already logged in
// // //   useEffect(() => {
// // //     if (user) {
// // //       navigate(
// // //         user.role === "Childcare Centre"
// // //           ? "/childcare-centre-dashboard"
// // //           : "/ece-dashboard"
// // //       );
// // //     }
// // //   }, [user, navigate]);

// // //   async function handleSubmit(e: React.FormEvent) {
// // //     e.preventDefault();
// // //     setError("");

// // //     try {
// // //       // First check if email already exists
// // //       const checkRes = await fetch(
// // //         `http://localhost:5000/users?email=${encodeURIComponent(email)}`
// // //       );
// // //       const existingUsers = await checkRes.json();

// // //       if (existingUsers.length > 0) {
// // //         setError("User with this email already exists. Please log in instead.");
// // //         return;
// // //       }

// // //       // Create new user object
// // //       const newUser: BaseUser = {
// // //         id: crypto.randomUUID(), // generates a unique ID
// // //         fullName,
// // //         email,
// // //         password, // ⚠️ plain text for MVP only
// // //         role,
// // //       };

// // //       // POST to json-server
// // //       const res = await fetch("http://localhost:5000/users", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(newUser),
// // //       });

// // //       if (!res.ok) {
// // //         throw new Error("Failed to create account");
// // //       }

// // //       alert("Signup successful! You can now log in.");
// // //       navigate("/login");

// // //       // Reset form fields
// // //       setFullName("");
// // //       setEmail("");
// // //       setPassword("");
// // //       setRole("ECE");
// // //     } catch (err) {
// // //       console.error(err);
// // //       setError("Signup failed. Please try again.");
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
// // //       <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
// // //         <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
// // //           Create a Lightning ECE Account
// // //         </h1>

// // //         {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

// // //         <form className="signup-form" onSubmit={handleSubmit}>
// // //           <div className="mb-4">
// // //             <label
// // //               htmlFor="fullName"
// // //               className="block text-sm font-medium text-gray-700"
// // //             >
// // //               Full Name:
// // //             </label>
// // //             <input
// // //               id="fullName"
// // //               type="text"
// // //               value={fullName}
// // //               onChange={(e) => setFullName(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
// // //             />
// // //           </div>

// // //           <div className="mb-4">
// // //             <label
// // //               htmlFor="email"
// // //               className="block text-sm font-medium text-gray-700"
// // //             >
// // //               Email:
// // //             </label>
// // //             <input
// // //               id="email"
// // //               type="email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
// // //             />
// // //           </div>

// // //           <div className="mb-4">
// // //             <label
// // //               htmlFor="password"
// // //               className="block text-sm font-medium text-gray-700"
// // //             >
// // //               Password:
// // //             </label>
// // //             <input
// // //               id="password"
// // //               type="password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
// // //             />
// // //           </div>

// // //           <div className="mb-4">
// // //             <label
// // //               htmlFor="role"
// // //               className="block text-sm font-medium text-gray-700"
// // //             >
// // //               Account Type:
// // //             </label>
// // //             <div className="flex gap-4">
// // //               <label className="flex items-center gap-1">
// // //                 <input
// // //                   type="radio"
// // //                   value="ECE"
// // //                   checked={role === "ECE"}
// // //                   onChange={() => setRole("ECE")}
// // //                 />
// // //                 ECE
// // //               </label>
// // //               <label className="flex items-center gap-1">
// // //                 <input
// // //                   type="radio"
// // //                   value="Childcare Centre"
// // //                   checked={role === "Childcare Centre"}
// // //                   onChange={() => setRole("Childcare Centre")}
// // //                 />
// // //                 Childcare Centre
// // //               </label>
// // //             </div>
// // //           </div>

// // //           <button
// // //             type="submit"
// // //             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
// // //           >
// // //             Sign Up
// // //           </button>

// // //           <p className="mt-4 text-sm text-gray-600 text-center">
// // //             Already have an account?{" "}
// // //             <Link to="/login" className="text-blue-600 hover:underline">
// // //               Login
// // //             </Link>
// // //           </p>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // // Version 1
// // // import { Link } from "react-router-dom";
// // // import { useState } from "react";
// // // import { useEffect } from "react";
// // // import { useAuth } from "../context/AuthContext";
// // // import { useNavigate } from "react-router-dom";
// // // import type { BaseUser } from "../types/User";

// // // export default function Signup() {
// // //   const { user } = useAuth();
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     // If user is already logged in, redirect to dashboard
// // //     if (user) {
// // //       navigate(user.role === "Childcare Centre" ? "/childcare-centre-dashboard" : "/ece-dashboard");
// // //     }
// // //   }, [user, navigate]);

// // //   const [id] = useState(''); // In a real app, use a proper ID generator
// // //   const [firstName, setFirstName] = useState('');
// // //   const [lastName, setLastName] = useState('');
// // //   const [fullName, setFullName] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [role, setRole] = useState<'ECE' | 'Childcare Centre'>('ECE');
// // //   // const [firstName, setFirstName] = useState('');
// // //   // const [lastName, setLastName] = useState('');

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     // Passwords are stored in plain text only for MVP demonstration
// // //     const user: BaseUser = {
// // //       id,
// // //       firstName,
// // //       lastName,
// // //       fullName,
// // //       email,
// // //       password,
// // //       role,
// // //     };

// // //     const usersJSON = localStorage.getItem('users');
// // //     const users = usersJSON ? JSON.parse(usersJSON) : [];

// // //     // Check if user already exists
// // //     const userExists = users.some((u: any) => u.email === email);
// // //     if (userExists) {
// // //       alert('User with this email already exists. Please use a different email.');
// // //       return;
// // //     }
// // //     // Add new user to the list
// // //     users.push(user);
// // //     // Save updated users list to localStorage
// // //     localStorage.setItem('users', JSON.stringify(users));
// // //     alert('Signup successful! You can now log in.');

// // //     navigate('/login');

// // //     // // You can also reset the form fields after successful signup
// // //     setFirstName('');
// // //     setLastName('');
// // //     setFullName('');
// // //     setEmail('');
// // //     setPassword('');
// // //     setRole('ECE');
// // //   };

// // //   return (
// // //     <div>
// // //       <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
// // //         <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
// // //           <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Create a Lightning ECE Account</h1>
// // //           <form className="signup-form" onSubmit={handleSubmit}>
// // //             <div className="mb-4">
// // //             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
// // //               Full Name: 
// // //             </label>
// // //             <input
// // //               id="fullName"
// // //               type="text"
// // //               value={fullName}
// // //               onChange={(e) => setFullName(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// // //               Email: 
// // //             </label>
// // //             <input
// // //               id="email"
// // //               type="email"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
// // //               Password: 
// // //             </label>
// // //             <input
// // //               id="password"
// // //               type="password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               required
// // //               className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
// // //             />
// // //           </div>
// // //           <div className="mb-4">
// // //             <label htmlFor="role" className="block text-sm font-medium text-gray-700">
// // //               Account Type: <span>(Are you an Early Childhood Educator or a Childcare Centre?)</span>
// // //             </label>
// // //             <div className="flex gap-4">
// // //               <label htmlFor="role-ece" className="flex items-center gap-1">
// // //                 <input
// // //                   id="role-ece"
// // //                   type="radio"
// // //                   value="ECE"
// // //                   checked={role === 'ECE'}
// // //                   onChange={(e) => setRole(e.target.value as 'ECE')}
// // //                 />
// // //                 ECE (Early Childhood Educator)
// // //               </label>
// // //               <label htmlFor="role-childcare-centre" className="flex items-center gap-1">
// // //                 <input
// // //                   id="role-childcare-centre"
// // //                   type="radio"
// // //                   value="Childcare Centre"
// // //                   checked={role === 'Childcare Centre'}
// // //                   onChange={(e) => setRole(e.target.value as 'Childcare Centre')}
// // //                 />
// // //                 Childcare Centre
// // //               </label>
// // //             </div>
// // //           </div>
// // //           <button
// // //             type="submit"
// // //             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// // //           >
// // //             Sign Up
// // //           </button>
// // //           <p className="mt-4 text-sm text-gray-600 text-center">
// // //             Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
// // //           </p>
// // //           </form>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }