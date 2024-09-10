import React, { useEffect, useState, useContext } from 'react';
import { Chart } from "react-google-charts"; // Importe o Chart corretamente aqui
import axios from 'axios';
import { DateContext } from '../../../context/DateContext';
import PermissionComponent from '../../PermissionComponent';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function VendasMensaisMeta() {
  const { login } = useAuth();
  const dateContext = useContext(DateContext);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("");

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR').replace(/\./g, 'X').replace(/,/g, '.').replace(/X/g, ',');
  };

  useEffect(() => {
    const fetchBackgroundColor = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bgColor = rootStyle.getPropertyValue('--chart-secondary-color').trim();
      console.log('Background Color:', bgColor);
      setBackgroundColor(bgColor);
    };

    fetchBackgroundColor();

    const handleColorModeChange = () => {
      fetchBackgroundColor();
    };

    const observer = new MutationObserver(handleColorModeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dateContext) return;

        const { startDate, endDate } = dateContext.dates;

        let response;
        if (await PermissionComponent.hasPermission("Admin_Role,Admin")) {
          response = await api.get('/dados_vendas_mensais', {
            params: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            }
          });
        } else {
          response = await api.get('/dados_vendas_mes_vendedor', {
            params: {
              vendedor: login,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            }
          });
        }

        const data = response.data;

        if (data.length === 0) {
          setChartData([["Month"]]);
          setLoading(false);
          return;
        }

        const productKeys = Array.from(new Set(data.flatMap(item => Object.keys(item.produtos))));

        const monthlyData = monthNames.map((month, index) => {
          const itemsForMonth = data.filter(d => d.mes - 1 === index);
          if (itemsForMonth.length === 0) return { month, values: Array(productKeys.length).fill(0) };
          
          const totalValues = Array(productKeys.length).fill(0);
          itemsForMonth.forEach(item => {
            productKeys.forEach((key, i) => {
              if (typeof key === 'string' && item.produtos[key]) {
                totalValues[i] += parseFloat(item.produtos[key]) || 0;
              }
            });
          });

          return { month, values: totalValues };
        });

        const generateMeta = () => 50000;

        const formattedData = [
          ["Month", ...productKeys.map(product => `${product} (R$)`), "Total (R$)", "Meta (R$)"]
        ];

        monthlyData.forEach(({ month, values }, index) => {
          const total = values.reduce((sum, val) => sum + val, 0);
          formattedData.push([
            month,
            ...values,
            total,
            generateMeta()
          ]);
        });

        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateContext]);

  useEffect(() => {
    const customizeChart = () => {
      const chartElement = document.querySelector('.vendas-gerais-mensais svg');
      if (chartElement) {
        const firstRect = chartElement.querySelector('rect');
        if (firstRect) {
          firstRect.style.fill = 'var(--chart-secondary-color)';
          firstRect.style.backgroundColor = 'var(--chart-secondary-color)';
        }
      }
    };

    customizeChart();
  }, [chartData, backgroundColor]);

  const options = {
    title: "Vendas Mensais por Produto",
    vAxis: {
      title: "Valores em R$",
      format: (value: number) => value,
      viewWindow: {
        min: 0,
        max: 50000,
      },
      ticks: [0, 10000, 20000, 30000, 40000, 50000].map(value => ({
        v: value,
        f: formatCurrency(value)
      })) as any[], // Converter para any[] para evitar erros de tipo
      textStyle: {
        fontSize: 12
      },
      gridlines: {
        count: 6
      }
    },
    hAxis: { title: "Mês" },
    seriesType: "bars",
    series: {
      [chartData[0]?.length - 2]: { type: "line" },
      [chartData[0]?.length - 3]: { type: "line" }
    },
    backgroundColor: backgroundColor,
    chartArea: {
      width: "80%",
      height: "60%"
    },
    tooltip: {
      isHtml: true,
      textStyle: { color: '#757575' },
      trigger: 'selection'
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ boxShadow: "var(--light-shadow1)", borderRadius: "8px", overflow: "hidden" }}>
      <Chart
        chartType="ComboChart"
        width="100%"
        height="337px"
        data={chartData}
        options={options}
        chartEvents={[
          {
            eventName: 'ready', // Corrigido para 'ready'
            callback: ({ chartWrapper }) => {
              const chart = chartWrapper.getChart();
              const container = document.getElementById(chartWrapper.getContainerId());
              const elements = container?.getElementsByTagName('text');
        
              if (elements) {
                for (let element of elements) {
                  if (element.getAttribute('text-anchor') === 'end') {
                    const value = element.textContent.replace(/[^0-9.,]+/g, '');
                    const number = parseFloat(value);
                    element.textContent = formatCurrency(number);
                  }
                }
              }
            }
          }
        ]}
      />
    </div>
  );
}
