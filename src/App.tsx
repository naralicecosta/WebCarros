import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { New } from "./pages/dashboard/new/New";
import { CarDetail } from "./pages/car/CarDetail";

import { Layout } from "./components/layout/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children:[
      {
        path: '/',
        element:<Home/>

      },
      {
        path: '/car/:id',
        element: <CarDetail />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/dashboard/new',
        element: <New/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])
export {router}