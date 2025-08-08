import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollTop from 'components/ScrollTop';
import './app.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //
const queryClient = new QueryClient();
export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <QueryClientProvider client={queryClient}>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
