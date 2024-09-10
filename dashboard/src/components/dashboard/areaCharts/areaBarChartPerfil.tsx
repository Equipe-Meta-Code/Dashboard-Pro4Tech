import React, { useEffect, useState, useContext } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from 'axios';
import numeral from 'numeral';
import { useAuth } from '../../../context/AuthContext';
import { DateContext } from '../../../context/DateContext'; // Importe o contexto de data
import api from '../../../services/api';

interface AreaBarChartProps {
  vendedorSelecionado?: number | string; // Permite que vendedorSelecionado seja um número ou string
}

const AreaBarChartPerfil: React.FC<AreaBarChartProps> = ({ vendedorSelecionado }) => {
  const { login } = useAuth();
  const dateContext = useContext(DateContext); // Obtenha o contexto de data
  const { dates } = dateContext; // Obtenha as datas do contexto
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yDomain, setYDomain] = useState([0, 10000]); // Inicialize com um valor padrão
  const [dataVendedores, setDataVendedores] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the vendedores data on component mount
    const fetchVendedores = async () => {
      try {
        const response = await api.get("/vendedores");
        setDataVendedores(response.data);
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
      }
    };

    fetchVendedores();
  }, []);

  useEffect(() => {
    if (dates && vendedorSelecionado !== undefined) {
      fetchData();
    }
  }, [dates, vendedorSelecionado]);

  const buscarCPFPorId = (idVendedor: number) => {
    const vendedor = dataVendedores.find(v => v.id === idVendedor);
    if (vendedor) {
      return vendedor.CPF_Vendedor;
    } else {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      let response;
      const vendedorId = +vendedorSelecionado!; // Transforma vendedorSelecionado em número
      
      const cpfVendedor = buscarCPFPorId(vendedorId);

      if (!cpfVendedor) {
        console.error('Erro ao buscar CPF do vendedor');
        return;
      }


      response = await api.get('/dados_vendas_mes_vendedor', {
        params: {
          vendedor: cpfVendedor,
          startDate: dates.startDate.toISOString(), // Adiciona a data de início ao request
          endDate: dates.endDate.toISOString() // Adiciona a data de fim ao request
        }
      });

      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const data = response.data.map(item => {
        const monthIndex = item.mes - 1;
        const monthName = monthNames[monthIndex];
        return { ...item, mes: monthName };
      });

      const allMonthsData = monthNames.map(month => ({
        mes: month,
        total_vendas: 0
      }));

      const mergedData = allMonthsData.map(monthData => {
        const foundData = data.find(item => item.mes === monthData.mes);
        return foundData ? foundData : monthData;
      });

      const salesValues = mergedData.map(item => item.total_vendas);
      const minSales = Math.min(...salesValues);
      const maxSales = Math.max(...salesValues);

      setYDomain([minSales, Math.ceil(maxSales * 1)]);

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
                <YAxis domain={yDomain} tickCount={6} tickFormatter={(value) => `R$${value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}/>
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

export default AreaBarChartPerfil;
