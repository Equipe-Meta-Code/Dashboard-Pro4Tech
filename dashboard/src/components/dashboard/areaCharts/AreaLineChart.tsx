import { useEffect, useState } from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaArrowUpLong } from "react-icons/fa6";
import "./AreaCharts.scss";
import axios from "axios";

const AreaLineChart = () => {
  const [chartData, setChartData] = useState([]);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dados_vendas');
      const data = response.data;
      const labels = data.map(item => item.Vendedor);
      const valores = data.map(item => item.total_vendas);
      const chartData = labels.map((label, index) => ({
        name: label,
        sales: valores[index]
      }));
      setChartData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
 
  return (
    <div className="line-chart">
      <div className="line-chart-info">
        <h5 className="line-chart-title">Vendas</h5>
        <div className="info-data-text">
          <FaArrowUpLong />
          <p>5% a mais que semana passada.</p>
        </div>
        <div className="chart-info-data"></div>
      </div>
      <div className="line-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={chartData}
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
            <Line
              type="monotone"
              dataKey="sales"
              name="Vendas"
              stroke="#fcb859"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaLineChart;
