import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/auth_context';
import AuthRoute from './routes/auth_route';

const queryClient = new QueryClient();

const Login = lazy(() => import("./core/public/login"));
const Register = lazy(() => import("./core/public/register"));
const Home = lazy(() => import("./core/public/home"));
const Explore = lazy(() => import("./core/public/explore"));
const ViewWebinar = lazy(() => import("./core/public/view_webinar"));
const UserProfile = lazy(() => import("./core/private/user/user_profile"));

function App() {
  const routes = [
    //--------------------------------Public Routes---------------------------------------
    {
      path: "/login",
      element: (
        <Suspense>
          <Login />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/register",
      element: (
        <Suspense>
          <Register />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/",
      element: (
        <Suspense>
          <Home />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/explore",
      element: (
        <Suspense>
          <Explore />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/explore/:query",
      element: (
        <Suspense>
          <Explore />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/view-webinar/:_id",
      element: (
        <Suspense>
          <ViewWebinar />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    //-------------------------------------------------------------------------------------------------
    {
      path: "/user-profile",
      element: (
        <AuthRoute requiredRole="user" element={<Suspense><UserProfile /></Suspense>} />
      )
    },
  ]

  const router = createBrowserRouter(routes);

  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
