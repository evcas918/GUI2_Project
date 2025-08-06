import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LogIn from './Log-In/LogIn.jsx'
import SignUpForm from './Registration/SignUpForm.jsx'
import HomePage from './ThinkDockUI/HomePage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './ThinkDockUI/Dashboard.jsx'
import WorkSpace from './Pages/WorkSpace.jsx'

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/workspace", element:<WorkSpace/>},
  {path:"/log-in", element:<LogIn/>},
  {path:"/sign-up", element:<SignUpForm/>},
  {path:"/home-page", element:<HomePage/>},
  {path:"/dashboard", element:<Dashboard/>}
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
