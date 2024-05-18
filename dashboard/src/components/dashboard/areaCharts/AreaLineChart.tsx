import { useEffect, useState } from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import "./AreaCharts.scss";
import axios from "axios";
import numeral from 'numeral';

const AreaLineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [yDomain, setYDomain] = useState([0, 10000]); // Inicialize com um valor padrão

  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dados_vendas');
      const data = response.data;
      // Pré-processamento para pegar apenas os dois primeiros nomes de cada vendedor
      const processedData = data.map(item => ({
        name: item.Vendedor.split(' ').slice(0, 2).join(' '),
        sales: item.total_vendas
      }));
      
      // Encontrar os valores mínimos e máximos de vendas
      const salesValues = processedData.map(item => item.sales);
      const minSales = Math.min(...salesValues);
      const maxSales = Math.max(...salesValues);

      // Definir o domínio do eixo Y com base nos valores mínimos e máximos de vendas
      setYDomain([minSales, Math.ceil(maxSales * 1)]); // Ajuste conforme necessário para espaço extra
      
      setChartData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="line-chart">
      <div className="line-chart-info">
        <h5 className="line-chart-title">Vendas por vendedor</h5>
        <div className="info-data-text">
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
              right: 40,
              left: 20,
              bottom: 20,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis domain={yDomain} tickCount={6} tickFormatter={(value) => `R$` + `${value.toLocaleString('pt-BR')}`}/>
            {/* Usando o formatter personalizado para incluir "R$" no tooltip */}
            <Tooltip formatter={(value, name) => ['R$ ' + numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace('_', ','), name]}/>
            {chartData.length === 0 && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">Não há dados para exibir no gráfico.</text>
            )}
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