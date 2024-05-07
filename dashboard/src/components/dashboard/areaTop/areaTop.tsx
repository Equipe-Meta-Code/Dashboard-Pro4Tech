//calendário
import "./AreaTop.scss";
import { useRef, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";

const AreaTop = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  //const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  /*const handleInputClick = () => {
    setShowDatePicker(true);
  };

   const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  }; */

  /* useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); */

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
