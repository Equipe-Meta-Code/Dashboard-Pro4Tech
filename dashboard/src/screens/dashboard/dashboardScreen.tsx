import { AreaCards, AreaLineChart, AreaTop } from "../../components";
import AreaBarChart from "../../components/dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../../components/dashboard/areaCharts/areaProgressChart";

const Dashboard = () => {
  return (
    <ul className="content-area">
      
      <li className="calendario"><AreaTop /></li>
      <li className="top-produtos"><AreaProgressChart /></li>
      <li className="ganhos-mensais"><AreaCards /></li>
      <div className="linhaQuebrada"></div>
      <li className="vendas-gerais"><AreaBarChart /></li>
      <div className="linhaQuebrada"></div>
      <li className="vendas-por-vendedor"><AreaLineChart /></li>
      
    </ul>
  );
};

export default Dashboard;
