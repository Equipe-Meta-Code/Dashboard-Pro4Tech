import React, { useState, useEffect } from "react";
import { AreaCards, AreaLineChart, AreaTop } from "../../components";
import AreaBarChart from "../../components/dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../../components/dashboard/areaCharts/areaProgressChart";
import PermissionComponent from "../../components/PermissionComponent";
import { DateProvider } from "../../context/DateContext";


const Dashboard: React.FC = () => {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <DateProvider>
      <ul className="content-area">
        <li className="calendario"><AreaTop /></li>
        <li className="top-produtos"><AreaProgressChart /></li>
        <li className="ganhos-mensais"><AreaCards /></li>
        <div className="linhaQuebrada"></div>
        <li className="vendas-gerais"><AreaBarChart /></li>
        <div className="linhaQuebrada"></div>
        <PermissionComponent role="Admin_Role,Admin">
          <li className="vendas-por-vendedor"><AreaLineChart /></li>
        </PermissionComponent>
      </ul>
    </DateProvider>
  );
};

export default Dashboard;
