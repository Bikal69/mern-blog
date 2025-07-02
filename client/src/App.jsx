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
import PostPage from "./pages/PostPage.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import SearchPage from './pages/SearchPage.jsx'
import { signOutFailure, signOutSuccess } from "./redux/User/userSlice.js"
import { useDispatch } from "react-redux"
export default function App() {
  const dispatch=useDispatch();

  return (
  <BrowserRouter>
  <ScrollToTop/>
  <Header/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/sign-in' element={<Signin/>}/>
    <Route path='/sign-up' element={<SignUp/>}/>
    <Route path='/search' element={<SearchPage/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Route>
    <Route element={<OnlyAdminPrivateRoute/>}>
    <Route path='/create-post' element={<CreatePost/>}/>
    <Route path='/update-post/:postId' element={<UpdatePost/>}/>
    </Route>
    <Route path='/projects' element={<Projects/>}/>
    <Route path='/post/:postSlug' element={<PostPage/>}/>
  </Routes>
  <FooterComponent/>
  </BrowserRouter>
  )
}
