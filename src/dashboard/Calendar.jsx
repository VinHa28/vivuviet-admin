import React from "react";

const Calendar = ({ month = "Tháng 10, 2022", days = 31, highlight = 14, weekdays }) => {
  const week = weekdays || ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-50">
      <h4 className="font-bold text-sm mb-4">{month}</h4>
      <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
        {week.map((d) => (
          <div key={d} className="text-[#848484] font-bold">
            {d}
          </div>
        ))}

        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className={`p-2 rounded-md cursor-pointer ${
              i === highlight ? "bg-[#f7bd01] text-white shadow-md" : "hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
