import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from './common/Layout'
import './App.css'
import Verification from './pages/auth/Verification';
import PageNotFound from './pages/PageNotFound';
import ListOfExercise from './pages/exercise/ListOfExercise';
import ExerciseInformation from './pages/Exercise/ExerciseInformation';
import Login from './pages/auth/Login';
import Profile from './pages/profile/Profile'
import Register from "./pages/auth/Register";
import Home from './pages/Home'
import { LogGuard, AuthGuard } from './common/Gaurd'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <LogGuard>
          <Login />
        </LogGuard>
      ),
    },
    {
      path: "/verification",
      element: (
        <LogGuard>
          <Verification />
        </LogGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <LogGuard>
          <Register />
        </LogGuard>
      ),
    },
    {
      path: "/home",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Home /> },
        // {
        //   path: "users",
        //   children: [
        //     { path: "", element: <ListOfUser /> },
        //     { path: ":id", element: <UserInformation /> },
        //   ],
        // },
        {
          path: "exercise",
          children: [
            { path: "", element: <ListOfExercise /> },
            { path: "exercise-information/:id", element: <ExerciseInformation /> },
          ],
        },
        {
          path: "profile",
          element: <Profile />
        },
      ],
    },
    {
      path: "/*",
      element: <PageNotFound />
    },
  ]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App
