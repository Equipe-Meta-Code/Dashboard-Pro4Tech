import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from 'axios';
import PermissionComponent from '../../PermissionComponent';
import { useAuth } from '../../../context/AuthContext';

const AreaBarChart = () => {
  const { login } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Definindo os nomes dos meses
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      // Criando um array inicial com todos os meses e total_vendas igual a zero
      const initialData = monthNames.map((month, index) => ({
        mes: month,
        total_vendas: 0
      }));

      let response;
      if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
        response = await axios.get('http://localhost:8080/dados_vendas_mes');
      } else if (await PermissionComponent.hasPermission("User_Role")) {
        response = await axios.get('http://localhost:8080/dados_vendas_mes_user', {
          params: { vendedor: login }
        });
      }

      const apiData = response.data.map(item => ({
        mes: monthNames[item.mes - 1], // Convertendo o número do mês para o nome completo do mês
        total_vendas: item.total_vendas
      }));

      // Mesclando os dados da API com o array inicial
      const mergedData = initialData.map(monthData => {
        const monthSales = apiData.find(apiMonthData => apiMonthData.mes === monthData.mes);
        return monthSales ? { ...monthData, total_vendas: monthSales.total_vendas } : monthData;
      });

      setChartData(mergedData);
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
