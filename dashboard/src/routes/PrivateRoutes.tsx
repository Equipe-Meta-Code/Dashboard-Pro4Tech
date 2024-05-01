
import { Navigate, Outlet, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

type RoutesPropsData = RouteProps & {
    role?: string;
};


const PrivateRoutes: React.FC<RoutesPropsData> = ({role}) => {

    const [permissions, setPermissions] = useState([] as string[]);

    useEffect(() => {

        async function loadRoles() {
            const response = await api.get('/users/roles');
            const findRole = response.data.some((r: string) => role?.split(',').includes(r));
            setPermissions(findRole);
        }

        loadRoles();
    }, [])
 
    const { userLogged } = useAuth();

    if(!userLogged()) {
        return <Navigate to="/" />;
    }

    if(!role && userLogged()) {
        return <Outlet/>;
    }

    return permissions ? <Outlet/> : <Navigate to="/" />;
};

export default PrivateRoutes;

