import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaArrowUpLong } from "react-icons/fa6";
import "./AreaCharts.scss";

const data = [ //exemplo de dados
    {
      name: '1',
      thisWeekSales: 4000,
      lastWeekSales: 2400,
    },
    {
      name: '2',
      thisWeekSales: 3000,
      lastWeekSales: 1398,
    },
    {
      name: '3',
      thisWeekSales: 2000,
      lastWeekSales: 9800,
    },
    {
      name: '4',
      thisWeekSales: 2780,
      lastWeekSales: 3908,
    },
    {
      name: '5',
      thisWeekSales: 1890,
      lastWeekSales: 4800,
    },
    {
      name: '6',
      thisWeekSales: 3800,
      lastWeekSales: 2500,
    },
    {
      date: '7',
      thisWeekSales: 3490,
      lastWeekSales: 3490,
    },
  ];

const AreaLineChart = () => {

  return (
    <div className="line-chart">
      <div className="line-chart-info">
        <h5 className="line-chart-title">Vendas</h5>
        <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% a mais que semana passada.</p>
          </div>
        <div className="chart-info-data">
        </div>
      </div>
      <div className="line-chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lastWeekSales" name="Semana Passada" stroke="#a9dfd8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="thisWeekSales" name="Essa Semana" stroke="#fcb859" />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaLineChart;
