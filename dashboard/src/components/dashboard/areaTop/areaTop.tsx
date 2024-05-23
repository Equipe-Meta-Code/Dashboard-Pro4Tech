import React, { useEffect, useRef, useState, useContext } from "react";
import "./AreaTop.scss";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import ptBR from 'date-fns/locale/pt-BR';
import { DateContext } from "../../../context/DateContext";


const AreaTop: React.FC = () => {
  const dateContext = useContext(DateContext);

  if (!dateContext) {
    throw new Error("AreaTop must be used within a DateProvider");
  }

  const { dates, setDates } = dateContext;
  const [state, setState] = useState([
    {
      startDate: new Date(2023, 0, 1), // 1 de janeiro de 2023
      endDate: dates.endDate || new Date(), // data atual se endDate não estiver definido
      key: "selection",
    },
  ]);

  useEffect(() => {
    setDates({
      startDate: state[0].startDate,
      endDate: state[0].endDate
    });
  }, [state, setDates]);

  const dateRangeRef = useRef(null);

  const renderDayContent = (day: Date) => {
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
            locale={ptBR}
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
