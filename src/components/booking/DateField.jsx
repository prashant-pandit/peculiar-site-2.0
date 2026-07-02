import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useOutsideClick } from "../../hooks";
import {
  formatDate,
  isSameDate,
  monthFormatter,
  weekDays,
} from "../../utils";

export default function DateField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const pickerRef = useRef(null);
  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  useOutsideClick(pickerRef, () => setOpen(false));

  useEffect(() => {
    if (!value) {
      setSelectedDate(null);
    }
  }, [value]);

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const selectDate = (day) => {
    const nextDate = new Date(year, month, day);
    setSelectedDate(nextDate);
    onChange(formatDate(nextDate));
    setOpen(false);
  };

  const selectToday = () => {
    const nextDate = new Date();
    setSelectedDate(nextDate);
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    onChange(formatDate(nextDate));
    setOpen(false);
  };

  return (
    <div className="relative block space-y-2" ref={pickerRef}>
      <span className="label-caps text-on-surface-variant">{label}</span>
      <button
        className="form-field flex items-center justify-between gap-3 pr-4 text-left"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((currentValue) => !currentValue)}
      >
        <span
          className={
            selectedDate ? "text-on-surface" : "text-on-surface-variant/60"
          }
        >
          {value || "mm/dd/yyyy"}
        </span>
        <Calendar className="shrink-0 text-on-surface-variant" size={18} />
      </button>
      {open && (
        <div className="calendar-popover" role="dialog" aria-label={label}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-syne text-2xl font-bold text-on-surface">
              {monthFormatter.format(viewDate)}
            </h3>
            <div className="flex items-center gap-2">
              <button
                className="calendar-nav-button"
                type="button"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="calendar-nav-button"
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="calendar-grid mb-3">
            {weekDays.map((day) => (
              <span className="calendar-weekday" key={day}>
                {day}
              </span>
            ))}
            {calendarCells.map((day, index) =>
              day ? (
                <button
                  className={`calendar-day ${
                    selectedDate &&
                    isSameDate(new Date(year, month, day), selectedDate)
                      ? "selected"
                      : ""
                  } ${
                    isSameDate(new Date(year, month, day), today) ? "today" : ""
                  }`}
                  type="button"
                  key={`${month}-${day}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              ) : (
                <span key={`empty-${index}`} />
              ),
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              className="calendar-text-button"
              type="button"
              onClick={() => {
                setSelectedDate(null);
                onChange("");
              }}
            >
              Clear
            </button>
            <button
              className="calendar-text-button"
              type="button"
              onClick={selectToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
