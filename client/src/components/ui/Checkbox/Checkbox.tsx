import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export default function Checkbox({
  label,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className={`${styles.option} ${className}`} htmlFor={id}>
      <input id={id} type="checkbox" className={styles.input} {...props} />

      <span className={styles.label}>{label}</span>
    </label>
  );
}
