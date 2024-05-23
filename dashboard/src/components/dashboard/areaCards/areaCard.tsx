import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axios from "axios";
import PermissionComponent from "../../PermissionComponent";
import { useAuth } from '../../../context/AuthContext';
import numeral from 'numeral';
import { DateContext } from "../../../context/DateContext";

const AreaCard = ({ colors, percentFillValue, metaVendas }) => {
  const { login } = useAuth();
  const [totalVendas, setTotalVendas] = useState(null);
  const { dates } = useContext(DateContext); // Adicione a importação e o uso do contexto DateContext

  const fetchData = async () => {
    try {
      let response;
      if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
        response = await axios.get('http://localhost:8080/dados_vendas_total', {
          params: {
            startDate: dates.startDate.toISOString(),
            endDate: dates.endDate.toISOString()
          }
        });
      } else {
        response = await axios.get('http://localhost:8080/dados_vendas_total_user', {
          params: { 
            vendedor: login,
            startDate: dates.startDate.toISOString(),
            endDate: dates.endDate.toISOString()
          }
        });
      }
      const data = response.data;
      const totalVendasDoJson = data.total_vendas;
      setTotalVendas(totalVendasDoJson);
    } catch (error) {
      console.error('Erro ao buscar dados de vendas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dates]); // Adicione dates como dependência do useEffect


  // Formatando o valor monetário
  const formatCurrency = (value) => {
    return 'R$ ' + numeral(value).format('0,0.00').replace(',', '_').replace('.', ',').replace('_', '.');
  };

  // Calculando o valor restante necessário para atingir a meta
  const valorRestante = metaVendas - (totalVendas !== null ? totalVendas : 0);
  const valorRestanteFormatado = Math.abs(valorRestante); // Valor absoluto para mostrar corretamente
  const filledValue = ((metaVendas - valorRestante) / metaVendas) * 360;
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Faltam", value: remainedValue },
    { name: "Vendas Atingidas", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${((value / 360) * 100).toFixed(2)} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">Ganhos Mensais</h5>
        <div className="info-value">
          {totalVendas !== null ? formatCurrency(totalVendas) : "Carregando..."}
        </div>
        {valorRestante >= 0 ? (
          <p className="info-text">Faltam {formatCurrency(valorRestante)} para atingir a meta de vendas</p>
        ) : (
          <p className="info-text">A meta de vendas foi ultrapassada em {formatCurrency(valorRestanteFormatado)}</p>
        )}
      </div>
      <div className="area-card-chart">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx={100}
            cy={100}
            innerRadius={50}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ color: 'white' }} formatter={renderTooltipContent} />
        </PieChart>
      </div>
    </div>
  );
};

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  metaVendas: PropTypes.number.isRequired, // Adicione a validação para a meta de vendas
};

export default AreaCard;
