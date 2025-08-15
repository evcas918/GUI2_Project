import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LogIn from './Log-In/LogIn.jsx'
import SignUpForm from './Registration/SignUpForm.jsx'
import HomePage from './ThinkDockUI/HomePage.jsx'
import WorkSpace from './Pages/WorkSpace.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './ThinkDockUI/Dashboard.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId = "516722635273-q40sofb87rde0p57oo1f13ljnh5c6ctm.apps.googleusercontent.com";

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/workspace", element:<WorkSpace/>},
  {path:"/log-in", element:<LogIn/>},
  {path:"/sign-up", element:<SignUpForm/>},
  {path:"/home-page", element:<HomePage/>},
  {path:"/dashboard", element:<Dashboard/>}
]);

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <RouterProvider router={router}/>
  </GoogleOAuthProvider>
)
