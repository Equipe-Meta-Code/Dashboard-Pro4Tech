import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaArrowUpLong } from "react-icons/fa6";
import "./AreaCharts.scss";

const data = [ //exemplo de daods
  {
    mes: "Jan",
    lucro: 70,
    prejuizo: 100,
  },
  {
    mes: "Fev",
    lucro: 55,
    prejuizo: 85,
  },
  {
    mes: "Mar",
    lucro: 35,
    prejuizo: 90,
  },
  {
    mes: "Abril",
    lucro: 90,
    prejuizo: 70,
  },
  {
    mes: "Maio",
    lucro: 55,
    prejuizo: 80,
  },
  {
    mes: "Jun",
    lucro: 30,
    prejuizo: 50,
  },
  {
    mes: "Jul",
    lucro: 32,
    prejuizo: 75,
  },
  {
    mes: "Ago",
    lucro: 62,
    prejuizo: 86,
  },
  {
    mes: "Set",
    lucro: 55,
    prejuizo: 78,
  },
];

const AreaBarChart = () => {
  const formatTooltipValue = (value) => {
    return `${value}k`;
  };

  const formatYAxisLabel = (value) => {
    return `${value}k`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Vendas Gerais</h5>
        <div className="chart-info-data">
          <div className="info-data-value">$50.4M</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% a mais que nos mês passado.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="mes"
              tickSize={0}
              axisLine={false}
              tick={{
                fontSize: 14,
              }}
            />
            <YAxis
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="lucro"
              fill="#475be8"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="prejuizo"
              fill="#e3e7fc"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
