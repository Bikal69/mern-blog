import { BrowserRouter,Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Signin from "./pages/Signin"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import FooterComponent from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import CreatePost from "./pages/CreatePost.jsx"
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import UpdatePost from "./pages/UpdatePost"
export default function App() {
  return (
  <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/sign-in' element={<Signin/>}/>
    <Route path='/sign-up' element={<SignUp/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Route>
    <Route element={<OnlyAdminPrivateRoute/>}>
    <Route path='/create-post' element={<CreatePost/>}/>
    <Route path='/update-post/:postId' element={<UpdatePost/>}/>
    </Route>
    <Route path='/projects' element={<Projects/>}/>
  </Routes>
  <FooterComponent/>
  </BrowserRouter>
  )
}
