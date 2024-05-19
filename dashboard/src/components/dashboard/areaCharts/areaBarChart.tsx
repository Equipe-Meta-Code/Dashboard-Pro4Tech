import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from 'axios';
import numeral from 'numeral';
import PermissionComponent from '../../PermissionComponent';
import { useAuth } from '../../../context/AuthContext';

const AreaBarChart = () => {
  const { login } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState([0, 10000]); // Inicialize com um valor padrão

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Definindo os nomes dos meses
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      let response;
      if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
        response = await axios.get('http://localhost:8080/dados_vendas_mes');
      } else {
        response = await axios.get('http://localhost:8080/dados_vendas_mes_user', {
          params: { vendedor: login }
        });
      }
      
      const data = response.data.map(item => {
        // Convertendo o número do mês para o nome completo do mês
        const monthIndex = item.mes - 1; // Mês em JavaScript é baseado em zero
        const monthName = monthNames[monthIndex];
        return { ...item, mes: monthName };
      });

      // Criando um objeto para representar todos os meses do ano com vendas zeradas
      const allMonthsData = monthNames.map(month => ({
        mes: month,
        total_vendas: 0
      }));

      // Mesclando os dados recebidos com os meses do ano
      const mergedData = allMonthsData.map(monthData => {
        const foundData = data.find(item => item.mes === monthData.mes);
        return foundData ? foundData : monthData;
      });

      // Encontrar os valores mínimos e máximos de vendas
      const salesValues = mergedData.map(item => item.total_vendas);
      const minSales = Math.min(...salesValues);
      const maxSales = Math.max(...salesValues);

      // Definir o domínio do eixo Y com base nos valores mínimos e máximos de vendas
      setYDomain([minSales, Math.ceil(maxSales * 1)]); // Ajuste conforme necessário para espaço extra

      // Ordenando os dados por ordem dos meses
      mergedData.sort((a, b) => monthNames.indexOf(a.mes) - monthNames.indexOf(b.mes));
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
                  left: 20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                {/* forma que eu achei pra arrumar, ver se consigo voltar ao jeito antigo */}
                <YAxis domain={yDomain} tickCount={6} tickFormatter={(value) => `R$${value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}/>
                {/* Usando o formatter personalizado para incluir "R$" no tooltip */}
                <Tooltip formatter={(value, name) => ['R$ ' + numeral(value).format('0,0.00').replace('.', '_').replace(',', '.').replace('_', ','), name]}/>
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
