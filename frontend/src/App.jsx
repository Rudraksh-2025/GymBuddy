import './App.css'
import PageNotFound from './pages/PageNotFound';

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
      path: "/home",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Home /> },
        {
          path: "users",
          children: [
            { path: "", element: <ListOfUser /> },
            { path: ":id", element: <UserInformation /> },
          ],
        },
        {
          path: "exercise",
          children: [
            { path: "", element: <ListOfExercise /> },
            { path: ":id", element: <ExerciseInformation /> },
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
