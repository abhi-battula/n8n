import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home"
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WorkflowEditor from './components/WorkflowEditor'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/workflow/new"  element={<WorkflowEditor/>} />
        <Route path="/workflow/:workflowId" element={<WorkflowEditor/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
