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
const MyBookings = lazy(() => import("./core/private/user/my_bookings"));
const EmailForOtp = lazy(() => import("./core/public/forgot_password/email_for_otp"));
const VerifyOtp = lazy(() => import("./core/public/forgot_password/verify_otp"));
const ResetPassword = lazy(() => import("./core/public/forgot_password/reset_password"));
const Dashboard = lazy(() => import("./core/private/admin/dashboard"));
const Webinars = lazy(() => import("./core/private/admin/webinars"));
const WebinarDetails = lazy(() => import("./core/private/admin/webinar_details"));
const AdminProfile = lazy(() => import("./core/private/admin/admin_profile"));
const ChangePassword = lazy(() => import("./core/public/change_password"));
const AdminOtp = lazy(() => import("./core/private/admin/admin_otp"));

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

    {
      path: "/email-for-otp",
      element: (
        <Suspense>
          <EmailForOtp />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/verify-otp",
      element: (
        <Suspense>
          <VerifyOtp />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/reset-password",
      element: (
        <Suspense>
          <ResetPassword />
        </Suspense>
      ),
      errorElement: <>error</>
    },

    {
      path: "/change-password",
      element: (
        <Suspense>
          <ChangePassword />
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

    {
      path: "/my-bookings",
      element: (
        <AuthRoute requiredRole="user" element={<Suspense><MyBookings /></Suspense>} />
      )
    },

    {
      path: "/dashboard",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><Dashboard /></Suspense>} />
      )
    },

    {
      path: "/webinars",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><Webinars /></Suspense>} />
      )
    },

    {
      path: "/webinar-details/:_id",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><WebinarDetails /></Suspense>} />
      )
    },

    {
      path: "/admin-profile",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><AdminProfile /></Suspense>} />
      )
    },

    {
      path: "/admin-otp",
      element: (
        <AuthRoute requiredRole="admin" element={<Suspense><AdminOtp /></Suspense>} />
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
