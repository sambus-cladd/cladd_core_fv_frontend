import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';

const RequireAuth = ({ allowedRoles }) => {
    const { auth, isAuthenticated } = useAuth();
    const location = useLocation();

    // Verifica si el usuario está autenticado y si su rol está permitido
    const userRoles = Array.isArray(auth?.rol) ? auth.rol : auth?.rol ? [auth.rol] : [];

    return (
        isAuthenticated && userRoles.some(role => allowedRoles.includes(role))
            ? <Outlet /> // Renderiza las rutas hijas si está autorizado
            : <Navigate to="/BuenosAires/FlorencioVarela/Laboratorio/Login" state={{ from: location }} replace />
    );
};

export default RequireAuth;
