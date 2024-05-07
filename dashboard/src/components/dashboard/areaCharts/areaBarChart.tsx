import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from 'axios';

const AreaBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Definindo os nomes dos meses
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      const response = await axios.get('http://localhost:8080/dados_vendas_mes');
      const data = response.data.map(item => {
        // Convertendo o número do mês para o nome completo do mês
        const monthIndex = item.mes - 1; // Mês em JavaScript é baseado em zero
        const monthName = monthNames[monthIndex];
        return { ...item, mes: monthName };
      });
      // Ordenando os dados por ordem dos meses
      data.sort((a, b) => monthNames.indexOf(a.mes) - monthNames.indexOf(b.mes));
      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Vendas Gerais</h5>
        <div className="chart-info-data">
          <div className="info-data-value"></div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            chartData.length > 0 ? (
              <AreaChart
                width={500}
                height={400}
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `R$` + `${value.toLocaleString('pt-BR')}`}/>
                {/* Usando o formatter personalizado para incluir "R$" no tooltip */}
                <Tooltip formatter={(value, name) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, name]}/>
                <Area
                  type="monotone"
                  dataKey="total_vendas"
                  name="Total das vendas"
                  stroke="#a9dfd8"
                  fill="#a9dfd8"
                />
              </AreaChart>
            ) : (
              <p>Não há dados disponíveis.</p>
            )
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
