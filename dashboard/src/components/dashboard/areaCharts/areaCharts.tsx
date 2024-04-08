import AreaBarChart from "./areaBarChart"
import AreaProgressChart from "./areaProgressChart"

const AreaCharts = () => {
  return (
    <section className="content-area-charts">
      <div className="chart-container">
      <AreaBarChart /> 
      <AreaProgressChart />
      </div>
    </section>
  )
}

export default AreaCharts