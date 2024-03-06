import React from "react";
import { clsx } from "clsx";

import formatBugNumbers from "@utils/formatBigNumbers";
import { Transaction } from "@stores/WalletStore";

import classes from "./styles.module.css";

type Props = {
  pnl?: Transaction["pnl"] | null
};

const PNL: React.FC<Props> = ({ pnl }) => {
  if (!pnl) {
    return (
      <div className={clsx(classes.column, classes.alignCenter)}>
        <div className={classes.title}>Trade PNL</div>
        <span>Unknown</span>
      </div>
    );
  }

  const isNegative = pnl.value < 0;
  const prefix = pnl.value > 0 ? "" : "+";

  return (
    <div className={clsx(classes.column, classes.alignCenter)}>
      <div className={classes.title}>Trade PNL</div>
      <span
        className={clsx(
          classes.preventWrap,
          isNegative ? classes.negative : classes.positive,
        )}
      >
        {prefix}
        {formatBugNumbers(pnl.value)} SOL ({prefix}
        {formatBugNumbers(pnl.rate)}%)
      </span>
    </div>
  );
};

export default PNL;
