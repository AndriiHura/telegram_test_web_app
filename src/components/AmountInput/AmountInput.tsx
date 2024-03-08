import React from "react";
import classes from "./styles.module.css";
import { IMaskInput } from "react-imask";
import maskMap from "@components/FormItem/masks.ts";
import FormSlider from "@components/FormSlider";

type Props = {
  value: number;
  type: "SOL" | "ROCK";
  onChange: (value: number) => void;
  balance: number;
  masks: (keyof typeof maskMap)[];
};

const AmountInput: React.FC<Props> = ({
  type,
  masks,
  balance,
  value,
  onChange,
}) => {
  const [percent, setPercent] = React.useState(() => value / (balance / 100));

  const handleChangeInput = (stringValue: string) => {
    let value = Number(stringValue);

    if (value > balance) {
      value = balance;
    }

    onChange(value);
    setPercent(value / (balance / 100));
  };

  const handleChangeSlider = (percent: number) => {
    setPercent(percent);
    let multiplier = 1;
    let multipliedBalance = balance;

    while (multipliedBalance % 1 !== 0) {
      multiplier *= 10;
      multipliedBalance = balance * multiplier;

      if (multiplier >= 10 ** 6) break;
    }

    const numberValue = Math.floor(multipliedBalance / 100 * percent);
    const newValue = numberValue / multiplier;
    onChange(newValue);
  };

  return (
    <div className={classes.amountInput}>
      <div className={classes.label}>Amount ({type})</div>

      <div className={classes.inputWrapper}>
        <IMaskInput
          mask={masks.map((mask) => maskMap[mask])}
          unmask={true}
          value={String(value)}
          onAccept={handleChangeInput}
          className={classes.input}
        />

        <FormSlider value={percent} onChange={handleChangeSlider} />

        <div className={classes.description}>
          Balance: {balance} {type}
        </div>
      </div>
    </div>
  );
};

export default AmountInput;
