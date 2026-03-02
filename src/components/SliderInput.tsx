"use client";

import React, { useRef } from "react";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  onChangeImmediate?: (v: number) => void;
  className?: string;
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  format,
  onChange,
  onChangeImmediate,
  className = "",
}: SliderInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = format ? format(value) : value.toLocaleString();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = Math.min(max, Math.max(min, Number(e.target.value.replace(/,/g, ""))));
    if (onChangeImmediate) onChangeImmediate(v);
    else onChange(v);
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <label className="text-[var(--muted)] font-medium">{label}</label>
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            step={step}
            defaultValue={value}
            key={value}
            onBlur={handleNumberBlur}
            onKeyDown={handleNumberKeyDown}
            className="w-24 text-right bg-[var(--card-bg)] border border-[var(--border)] rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[var(--foreground)]"
          />
          {unit && <span className="text-[var(--muted)] text-xs">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>{format ? format(min) : min.toLocaleString()}</span>
        <span className="text-[var(--foreground)] font-semibold text-xs">{displayValue}{unit}</span>
        <span>{format ? format(max) : max.toLocaleString()}</span>
      </div>
    </div>
  );
}
