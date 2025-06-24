import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layout/Layout';
import Signup from './pages/Signup';
import ChildcareCentreDashboard from './pages/Childcare-Centre-Dashboard';
import ECEDashboard from './pages/ECE-Dashboard';
import RequireAuth from "./components/RequireAuth";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="childcare-centre-dashboard" element={<RequireAuth><ChildcareCentreDashboard /></RequireAuth>} />
          <Route path="ece-dashboard" element={<RequireAuth><ECEDashboard /></RequireAuth>} />
        </Route>
        <Route path="*" element={<div className="text-red-500">Lightning has not struck here! 404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
