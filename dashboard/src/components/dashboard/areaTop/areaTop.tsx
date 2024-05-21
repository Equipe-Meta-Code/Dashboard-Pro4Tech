//calendário
import "./AreaTop.scss";
import { useEffect, useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import axios from "axios";

const AreaTop = () => {

  const [vendas, setVendas] = useState([]);
  const [totalVendas, setTotalVendas] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [state, setState] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/vendas_filtradas", {
          params: {
            startDate: state[0].startDate.toISOString(),
            endDate: state[0].endDate.toISOString(),
          },
        });
        setVendas(response.data);
      } catch (error) {
        console.error('Erro ao buscar as vendas', error);
      }
    };

    fetchData();
  }, [state]);

  //const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  // personalizar o conteúdo dos dias
  const renderDayContent = (day) => {
    const date = day.getDate();
    return (
      <div style={{ color: `var(--calendar-day-color)` }}>{date}</div> 
    );
  };

  return (
    <section className="content-area-top">
      <div className="area-top-l"></div>
      <div className="area-top-r">
        <div className="custom-date-range" ref={dateRangeRef}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            showMonthAndYearPickers={false}
            dayContentRenderer={renderDayContent}
            className="custom-date-range"
          />
        </div>
      </div>
    </section>
  );
};

export default AreaTop;
