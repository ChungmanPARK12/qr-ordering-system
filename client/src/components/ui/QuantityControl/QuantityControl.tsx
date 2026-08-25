import Button from "@/components/ui/Button/Button";

import styles from "./QuantityControl.module.css";

interface QuantityControlProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function QuantityControl({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantityControlProps) {
  const handleDecrease = () => {
    if (value <= min) return;

    onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value >= max) return;

    onChange(value + 1);
  };

  return (
    <div className={styles.control}>
      <Button
        type="button"
        variant="secondary"
        onClick={handleDecrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </Button>

      <span className={styles.value}>{value}</span>

      <Button
        type="button"
        variant="secondary"
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
}
