import React, { useEffect, useState } from 'react';
import AreaCard from "./areaCard";
import "./AreaCards.scss";
import { useAuth } from '../../../context/AuthContext';
import PermissionComponent from '../../PermissionComponent';

const AreaCards = () => {
  const { login } = useAuth();
  const [metaVendas, setMetaVendas] = useState(50000);

  useEffect(() => {
    const setMeta = async () => {
      if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
        setMetaVendas(50000);
      } else if (await PermissionComponent.hasPermission("User_Role")) {
        setMetaVendas(10000);
      }
    };

    setMeta();
  }, [login]);

  return (
    <section className="content-area-cards">
      <AreaCard colors={["#0088FE", "#00C49F"]} percentFillValue={60} metaVendas={metaVendas} />
    </section>
  );
};

export default AreaCards;
