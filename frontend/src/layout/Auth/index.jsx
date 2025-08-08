import { Outlet,Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
// ==============================|| LAYOUT - AUTH ||============================== //

export default function AuthLayout() {
   const token = getToken();
  return token ? <Navigate to="/" replace />: <Outlet /> ;
}
