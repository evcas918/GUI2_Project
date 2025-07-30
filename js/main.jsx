import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WorkSpace from './Pages/WorkSpace.jsx'
import LogIn from './LogIn.jsx'
import CreateNewAccount from './CreateNewAccount.jsx'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/workspace", element:<WorkSpace/>},
  {path:"/log-in", element:<LogIn/>},
  {path:"/new account", element:<CreateNewAccount/>},
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
