import { useState, useEffect } from "react";
import { AreaCards, AreaLineChart, AreaTop } from "../../components";
import AreaBarChart from "../../components/dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../../components/dashboard/areaCharts/areaProgressChart";
import PermissionComponent from "../../components/PermissionComponent";

const Dashboard = () => {

  
  const [pageTitle, setPageTitle] = useState('Dashboard');
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);


  return (
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
  );
};

export default Dashboard;
