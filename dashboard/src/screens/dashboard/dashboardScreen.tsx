import { AreaCards, AreaLineChart, AreaTop } from "../../components";
import AreaBarChart from "../../components/dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../../components/dashboard/areaCharts/areaProgressChart";

const Dashboard = () => {
  return (
    <ul className="content-area">
      <li className="content-area-li-direita"><AreaTop /></li>
      <div className="linhaQuebrada"></div>
      <li className="content-area-li-esquerda"><AreaProgressChart /></li>
      <li className="content-area-li-direita"><AreaLineChart /></li>
      <div className="linhaQuebrada"></div>
      <li className="content-area-li-"><AreaCards /></li>
      <li className="content-area-li-direita"><AreaBarChart /></li>
      
    </ul>
  );
};

export default Dashboard;
