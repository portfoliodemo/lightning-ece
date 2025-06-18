import { Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <h1 className="text-5xl font-bold text-green-700">
          Lightning ECE is working!
        </h1>
      </div>

      <Routes>
        {/* Define your routes here */}
        {/* Example: */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
