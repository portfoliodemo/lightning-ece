import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Layout from './layout/Layout';

function App() {

  return (
    <>
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <h1 className="text-5xl font-bold text-green-700">
          Lightning ECE is working!
        </h1>
      </div> */}

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="*" element={<div className="text-red-500">Lightning has not struck here! 404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
