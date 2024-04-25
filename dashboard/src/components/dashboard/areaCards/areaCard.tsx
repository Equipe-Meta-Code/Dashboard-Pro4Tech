import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axios from "axios";

const AreaCard = ({ colors, percentFillValue, metaVendas }) => {
  const [totalVendas, setTotalVendas] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dados_vendas_total');
      const data = response.data;
      const totalVendasDoJson = data.total_vendas;
      setTotalVendas(totalVendasDoJson);
    } catch (error) {
      console.error('Erro ao buscar dados de vendas:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculando o valor restante necessário para atingir a meta
  const valorRestante = metaVendas - (totalVendas !== null ? totalVendas : 0);
  const percentualRestante = (valorRestante / metaVendas) * 100;
  const filledValue = ((metaVendas - valorRestante) / metaVendas) * 360;
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Faltam", value: remainedValue },
    { name: "Vendas Atingidas", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${(value / 360) * 100} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">Ganhos Mensais</h5>
        <div className="info-value">
          {totalVendas !== null ? `R$${totalVendas}` : "Carregando..."}
        </div>
        {valorRestante >= 0 ? (
          <p className="info-text">Faltam R${valorRestante.toFixed(2)} para atingir a meta de vendas</p>
        ) : (
          <p className="info-text">A meta de vendas foi ultrapassada em R${Math.abs(valorRestante)}</p>
        )}
      </div>
      <div className="area-card-chart">
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx={100}
            cy={130}
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
  percentFillValue: PropTypes.number.isRequired,
  metaVendas: PropTypes.number.isRequired, // Adicione a validação para a meta de vendas
};

export default AreaCard;
