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

  const handleSelect = (date) => {
    let filtrar = totalVendas.filter((venda) => {
      let vendaData = new Date(venda["createdAt"]);
      return ( 
        vendaData >= date.selection.startDate && 
        vendaData <= date.selection.endDate
      )
    })
    setStartDate(date.selection.startDate)
    setEndDate(date.selection.endDate)
    setVendas(filtrar);
  }

  useEffect(() => {
    axios
    .get("'http://localhost:8080/vendas_filtradas")
    .then((response) => {
      setVendas(response.data)
      setTotalVendas(response.data)

    })
});

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
            onChange={handleSelect}
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
