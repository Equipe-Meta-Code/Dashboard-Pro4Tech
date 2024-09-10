import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import numeral from 'numeral';
import { DateContext } from '../../../context/DateContext'; // Importe o contexto de data
import api from '../../../services/api';

const AreaLineChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [yDomain, setYDomain] = useState([0, 10000]); // Inicialize com um valor padrão
  const dateContext = useContext(DateContext); // Obtenha o contexto de data

  useEffect(() => {
    fetchData();
  }, [dateContext]); // Atualize o useEffect para observar as alterações no contexto de data

  const fetchData = async () => {
    try {
      if (!dateContext) return; // Se o contexto de data não estiver disponível, retorne

      const { startDate, endDate } = dateContext.dates; // Obtenha as datas do contexto de data

      const response = await api.get('/dados_vendas', {
        params: {
          startDate: startDate.toISOString(), // Use a data de início do contexto de data
          endDate: endDate.toISOString() // Use a data de término do contexto de data
        }
      });
      
      const data = response.data;
      const processedData = data.map(item => ({
        name: item.Vendedor.split(' ').slice(0, 2).join(' '),
        total_vendas: item.total_vendas
      }));

      const salesValues = processedData.map(item => item.total_vendas);
      const minSales = Math.min(...salesValues);
      const maxSales = Math.max(...salesValues);

      setYDomain([minSales, Math.ceil(maxSales * 1)]);
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
        <div className="info-data-text"></div>
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
            <Tooltip formatter={(value, name) => ['R$ ' + numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace(',', '.').replace('_', ','), name]}/>
            {chartData.length === 0 && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">Não há dados para exibir no gráfico.</text>
            )}
            <Line
              type="monotone"
              dataKey="total_vendas"
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
