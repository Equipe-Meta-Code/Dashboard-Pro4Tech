import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { RouteProps } from "react-router-dom";

interface PermissionComponentProps {
    children: React.ReactNode;
    role: string;
}


const PermissionComponent: React.FC<PermissionComponentProps> = ({role, children}) => {

    const [permissions, setPermissions] = useState([] as string[]);

    useEffect(() => {

        async function loadRoles() {
            const response = await api.get('/users/roles');
            console.log('permission');
            const findRole = response.data.some((r: string) => role.split(',').includes(r));
            setPermissions(findRole);
        }

        loadRoles();
    }, [role]);

    return (
        <>
            {permissions && children}
        </>
    )
}

export default PermissionComponent;