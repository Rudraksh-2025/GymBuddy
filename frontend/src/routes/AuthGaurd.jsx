import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/auth';

const AuthGuard = () => {
    const token = getToken();
    // return token ? <Outlet /> : <Navigate to="/login" replace />;
    return token ? <Outlet /> : <Outlet />;

};

export default AuthGuard;
