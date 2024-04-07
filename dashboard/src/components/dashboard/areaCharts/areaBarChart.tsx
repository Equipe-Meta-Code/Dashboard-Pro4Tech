import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./AreaCharts.scss";

const data = [ //exemplo de dados
  {
    mes: "Jan",
    sales: 70,
  },
  {
    mes: "Fev",
    sales: 55,
  },
  {
    mes: "Mar",
    sales: 35,
  },
  {
    mes: "Abril",
    sales: 90,
  },
  {
    mes: "Maio",
    sales: 55,
  },
  {
    mes: "Jun",
    sales: 49,
  },
  {
    mes: "Jul",
    sales: 32,
  },
  {
    mes: "Ago",
    sales: 62,
  },
  {
    mes: "Set",
    sales: 87,
  },
  {
    mes: "Out",
    sales: 55,
  },
  {
    mes: "Nov",
    sales: 85,
  },
  {
    mes: "Dez",
    sales: 108,
  },
];

const AreaBarChart = () => {

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Vendas Gerais</h5>
        <div className="chart-info-data">
          <div className="info-data-value">$50.4M</div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="sales" stroke="#a9dfd8" fill="#a9dfd8" />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
