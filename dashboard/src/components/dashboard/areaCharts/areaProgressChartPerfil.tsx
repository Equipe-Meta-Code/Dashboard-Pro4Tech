import React, { useEffect, useState, useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import "./AreaCharts.scss";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../../context/AuthContext';
import { DateContext } from '../../../context/DateContext';
import api from '../../../services/api';

interface ChartData {
  Produto: string;
  quantidade_vendida: number;
}

interface AreaProgressChartProps {
  vendedorSelecionado?: number;
}

const AreaProgressChartPerfil: React.FC<AreaProgressChartProps> = ({ vendedorSelecionado }) => {
  const { login } = useAuth();
  const dateContext = useContext(DateContext);

  if (!dateContext) {
    throw new Error("AreaProgressChart must be used within a DateProvider");
  }

  const { dates } = dateContext;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
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
      console.log('vendedor', vendedor);
      let cpf = vendedor.CPF_Vendedor 
      console.log('vendedorCPF', cpf);
      return cpf;
    } else {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      let response: AxiosResponse<any, any>;
      const vendedorId = +vendedorSelecionado!;
      console.log("Tipo de vendedorSelecionado:", typeof vendedorId);

      let cpfVendedor = buscarCPFPorId(vendedorId);

      if (!cpfVendedor) {
        console.error('Erro ao buscar CPF do vendedor');
        return;
      }

      console.log("CPF USADO: ", cpfVendedor);

      response = await api.get('/dados_itens_vendedor', {
        params: {
          vendedor: cpfVendedor,
          startDate: dates.startDate.toISOString(),
          endDate: dates.endDate.toISOString()
        }
      });

      const data: ChartData[] = response.data;
      setChartData(data);
      setLoading(false);

      const totalVendido = data.reduce((acc, item) => acc + item.quantidade_vendida, 0);
      setTotal(totalVendido);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Itens Mais Vendidos</h4>
      </div>
      <div className="progress-bar-list">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          chartData.length > 0 ? (
            chartData.map((item) => (
              <div className="progress-bar-item" key={uuidv4()}>
                <div className="bar-item-info">
                  <p className="bar-item-info-name">{item.Produto}</p>
                  <p className="bar-item-info-value">
                    {item.quantidade_vendida} ({((item.quantidade_vendida / total) * 100).toFixed(2)}% do total)
                  </p>
                </div>
                <div className="bar-item-full">
                  <div
                    className="bar-item-filled"
                    style={{
                      width: `${(item.quantidade_vendida / total) * 100}%`, // Convertendo para porcentagem
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <span>Não há dados para exibir no gráfico.</span>
          )
        )}
      </div>
    </div>
  );
};

export default AreaProgressChartPerfil;
