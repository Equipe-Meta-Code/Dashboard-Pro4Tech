import { AreaCards, AreaLineChart, AreaTop } from "../../components";
import AreaBarChart from "../../components/dashboard/areaCharts/areaBarChart";
import AreaProgressChart from "../../components/dashboard/areaCharts/areaProgressChart";

const Dashboard = () => {
  return (
    <div className="content-area">
      <AreaTop />
      <AreaProgressChart />
      <AreaLineChart />
      <AreaBarChart />
      <AreaCards />
    </div>
  );
};

export default Dashboard;
