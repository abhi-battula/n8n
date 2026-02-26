import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home"
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/workflow/new" />
        <Route path="/workflose/:workflowId" />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
