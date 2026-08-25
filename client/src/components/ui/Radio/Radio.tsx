import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Radio.module.css";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export default function Radio({
  label,
  id,
  className = "",
  ...props
}: RadioProps) {
  return (
    <label className={`${styles.option} ${className}`} htmlFor={id}>
      <input id={id} type="radio" className={styles.input} {...props} />

      <span className={styles.label}>{label}</span>
    </label>
  );
}
