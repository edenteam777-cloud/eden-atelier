"use client";
import { InputHTMLAttributes } from "react";
import { formatPhone } from "@/lib/format";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

export default function PhoneInput({ value, onChange, ...props }: Props) {
  return (
    <input
      {...props}
      type="tel"
      className="input"
      value={value}
      onChange={(e) => onChange(formatPhone(e.target.value))}
      placeholder="(00) 00000-0000"
    />
  );
}
