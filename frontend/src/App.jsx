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
import WeightTracking from "./pages/weightTracking/WeightTracking";
import FoodTracking from "./pages/food/FoodTracking";
import CalorieTracking from "./pages/calorie/CalorieTracking";

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
          path: "calorie",
          children: [
            { path: "", element: <CalorieTracking /> },
          ],
        },
        {
          path: "food",
          children: [
            { path: "", element: <FoodTracking /> },
          ],
        },
        {
          path: "weight",
          children: [
            { path: "", element: <WeightTracking /> },
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
