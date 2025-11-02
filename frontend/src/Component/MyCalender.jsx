import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { days } from "../utils/dayTimeSlot";

export default function MyCalendar({ onDateChange }) {
  const now = new Date();
  const [date, setDate] = useState(now);
  const [currentMonth, setCurrentMonth] = useState(now);

  const handleDateClick = (day) => {
    setDate(day);
    const dayName = days[day.getDay()];
    const formattedDate = format(day, "yyyy-MM-dd");
    onDateChange(formattedDate, dayName);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const isToday = (date) => isSameDay(date, now);
  const isSelected = (date) => isSameDay(date, new Date(date));
  const isCurrentMonth = (date) => isSameMonth(date, currentMonth);
  const isPastDate = (date) => date < now && !isToday(date);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-blue-200/50 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-blue-700" />
        </button>

        <h2 className="text-xl font-bold text-blue-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-blue-200/50 rounded-lg transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-blue-700" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-blue-700 text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const isPassedDate = isPastDate(day);
          const isCurrentDay = isToday(day);
          const isChosenDay = isSameDay(day, date);
          const isNotCurrentMonth = !isCurrentMonth(day);

          return (
            <button
              key={idx}
              onClick={() => !isPassedDate && handleDateClick(day)}
              disabled={isPassedDate}
              className={`
                relative w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
                ${isCurrentDay
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                  : isChosenDay
                  ? "bg-gradient-to-br from-indigo-400 to-blue-500 text-white shadow-md"
                  : isNotCurrentMonth
                  ? "text-gray-300"
                  : isPassedDate
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-blue-200/60 hover:shadow-md"
                }
              `}
            >
              {format(day, "d")}
              {isCurrentDay && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      <div className="mt-6 pt-6 border-t border-blue-200">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Selected Date</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-900">
                {format(date, "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                {days[date.getDay()]}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Past dates are disabled. Select a date from today onwards.
      </p>
    </div>
  );
}