import { Link } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ECE' | 'Childcare Centre'>('ECE');

  const handleSubmit = () => (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      fullName,
      email,
      password,
      role,
    };

    const usersJSON = localStorage.getItem('users');
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    // Check if user already exists
    const userExists = users.some((u: any) => u.email === email);
    if (userExists) {
      alert('User with this email already exists. Please use a different email.');
      return;
    }
    // Add new user to the list
    users.push(user);
    // Save updated users list to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! You can now log in.');

    // Redirect to login, potentially use useNavigate from 'react-router-dom' for programmatic navigation
    // For example, if you are using React Router, you can use the useNavigate hook:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/login');
    window.location.href = '/login';

    // // You can also reset the form fields after successful signup
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('ECE');

    // // Note: In a real application, you would typically handle the signup logic with a backend API
    // // For example, you might send the user data to your server for processing
    // // and then redirect the user to a login page or dashboard.
    // // This is a simple example to demonstrate the signup form functionality.
    // console.log('User signed up:', user);


    // Here you would typically handle the signup logic, such as sending the data to your backend
    // console.log('Form submitted:', { fullName, email, password, role });
    // Reset form fields after submission
    // setFullName('');
    // setEmail('');
    // setPassword('');
    // setRole('ECE');
  };

  return (
    <div>
      <h1>
        Lightning ECE Signup Form
      </h1>
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Create an Account</h1>
          <form className="signup-form" onSubmit={handleSubmit()}>
            <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name: 
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email: 
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password: 
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role: 
            </label>
            {/* <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ECE' | 'Owner')}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ECE">Early Childhood Educator</option>
              <option value="Owner">Daycare Owner</option>
            </select> */}
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="ECE"
                  checked={role === 'ECE'}
                  onChange={(e) => setRole(e.target.value as 'ECE')}
                />
                ECE (Early Childhood Educator)
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="Childcare Centre"
                  checked={role === 'Childcare Centre'}
                  onChange={(e) => setRole(e.target.value as 'Childcare Centre')}
                />
                Childcare Centre
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
          </form>
        </div>
      </div>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  );
}