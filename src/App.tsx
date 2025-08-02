import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layout/Layout';
import Signup from './pages/Signup';
import ForgotPassword from './pages/Forgot-Password';
import ChildcareCentreDashboard from './pages/Childcare-Centre-Dashboard';
import ECEDashboard from './pages/ECE-Dashboard';
import RequireAuth from "./components/RequireAuth";
import ScrollToTop from './components/ScrollToTop';

function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="childcare-centre-dashboard" element={<RequireAuth><ChildcareCentreDashboard /></RequireAuth>} />
          <Route path="ece-dashboard" element={<RequireAuth><ECEDashboard /></RequireAuth>} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          {/* Uncomment the following lines when those components are implemented */}
          {/* <Route path="profile" element={<Profile />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
          {/* <Route path="contact-us" element={<ContactUs />} /> */}
          {/* <Route path="about-us" element={<AboutUs />} /> */}
          {/* <Route path="terms-of-service" element={<TermsOfService />} /> */}
          {/* <Route path="privacy-policy" element={<PrivacyPolicy />} /> */}
          {/* <Route path="help" element={<Help />} /> */}
          {/* <Route path="reset-password" element={<ResetPassword />} /> */}
          {/* <Route path="change-password" element={<ChangePassword />} /> */}
          {/* <Route path="notifications" element={<Notifications />} /> */}
          {/* <Route path="messages" element={<Messages />} /> */}
          {/* <Route path="faqs" element={<FAQs />} /> */}
          {/* <Route path="feedback" element={<Feedback />} /> */}
        </Route>
        <Route path="*" element={<div className="text-red-500">Lightning has not struck here! 404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
