
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './pages/home/Home';
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate';
import Profile from './pages/profile/Profile';
import ProtectRoute from './ProtectRoute';

function App() {

  const router = createBrowserRouter([
    {
      path: '/', element: <ProtectRoute />, children: [
        {path: '/', element: <Home />},
        { path: '/profile/update', element: <ProfileUpdate /> },
        { path: '/profile/:searchId', element: <Profile /> }
      ]
    },
    // {path:'/',element:<ProtectRoute><Home/></ProtectRoute>},
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> }
  ])

  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App
