import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "./AreaCharts.scss";
import { v4 as uuidv4 } from 'uuid';
import PermissionComponent from '../../PermissionComponent';
import { useAuth } from '../../../context/AuthContext';
import { DateContext } from '../../../context/DateContext';



interface ChartData {
  Produto: string;
  quantidade_vendida: number;
}

const AreaProgressChart: React.FC = () => {
  const { login } = useAuth();
  const dateContext = useContext(DateContext);

  if (!dateContext) {
    throw new Error("AreaProgressChart must be used within a DateProvider");
  }

  const { dates } = dateContext;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, [dates]);

  const fetchData = async () => {
    try {
      let response;
      if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
        response = await axios.get('http://localhost:8080/dados_itens', {
          params: {
            startDate: dates.startDate.toISOString(),
            endDate: dates.endDate.toISOString()
          }
        });
      } else {
        response = await axios.get('http://localhost:8080/dados_itens_user', {
          params: { 
            vendedor: login,
            startDate: dates.startDate.toISOString(),
            endDate: dates.endDate.toISOString()
          }
        });
      }

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

export default AreaProgressChart;
