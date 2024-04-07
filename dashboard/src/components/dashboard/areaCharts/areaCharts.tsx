import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"

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