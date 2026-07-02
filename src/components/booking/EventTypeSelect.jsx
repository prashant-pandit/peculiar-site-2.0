import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { eventTypes } from "../../constants";
import { useOutsideClick } from "../../hooks";

export default function EventTypeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  useOutsideClick(selectRef, () => setOpen(false));

  return (
    <div className="relative block space-y-2" ref={selectRef}>
      <span className="label-caps text-on-surface-variant">Event Type</span>
      <button
        className={`form-field custom-select-trigger ${open ? "open" : ""}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((currentValue) => !currentValue)}
      >
        <span>{value}</span>
        <ChevronDown
          className={`custom-select-chevron ${open ? "open" : ""}`}
          size={18}
        />
      </button>
      <input type="hidden" name="eventType" value={value} />
      {open && (
        <div
          className="custom-select-menu"
          role="listbox"
          aria-label="Event Type"
        >
          {eventTypes.map((type) => (
            <button
              className={`custom-select-option ${
                value === type ? "selected" : ""
              }`}
              type="button"
              role="option"
              aria-selected={value === type}
              key={type}
              onClick={() => {
                onChange(type);
                setOpen(false);
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
