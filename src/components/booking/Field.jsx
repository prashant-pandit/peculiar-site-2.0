import React from "react";

export default function Field({ label, icon, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="label-caps text-on-surface-variant">{label}</span>
      <span className="relative block">
        <input className={`form-field ${icon ? "pr-12" : ""}`} {...props} />
        {icon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </span>
        )}
      </span>
    </label>
  );
}
