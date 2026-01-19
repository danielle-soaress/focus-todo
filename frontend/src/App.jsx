import './App.scss'
import Dashboard from './pages/Dashboard/DashboardPage'
import LoginPage from './pages/AuthPage/AuthPage'
import HomePage from './pages/Home/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
