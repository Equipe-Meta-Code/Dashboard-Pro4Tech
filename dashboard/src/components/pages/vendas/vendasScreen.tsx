import AreaProgressChart from "../../dashboard/areaCharts/areaProgressChart";
import AreaBarChart from "../../dashboard/areaCharts/areaBarChart";
import AreaLineChart from "../../dashboard/areaCharts/AreaLineChart";

const Vendas = () => {
  return (
    <ul className="content-area">

      <li className="top-produtos" ><AreaProgressChart /></li>
      <div className="linhaQuebrada"></div>
      <li className="vendas-gerais"><AreaBarChart /></li>
      <div className="linhaQuebrada"></div>
      <li className="vendas-por-vendedor"><AreaLineChart /></li>
      
    </ul>
  )
}

export default Vendas