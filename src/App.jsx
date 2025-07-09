import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/auth_context';

const queryClient = new QueryClient();

const Login = lazy(() => import("./core/public/login"));

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
    }
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
