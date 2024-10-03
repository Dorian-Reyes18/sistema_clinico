import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarHome = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <h4 style={{ textAlign: "center" }}>Calendario</h4>
      <Calendar onChange={onChange} value={date} />
    </div>
  );
};

export default CalendarHome;
