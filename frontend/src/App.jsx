import './App.scss'
import Dashboard from './pages/Dashboard/DashboardPage'
import LoginPage from './pages/AuthPage/AuthPage'
import HomePage from './pages/Home/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { PublicOnlyRoute, PrivateRoute } from './routes/RouteGuards';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/" element={<HomePage/>} />
        </Route>

        <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<h1>Página não encontrada (404)</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
