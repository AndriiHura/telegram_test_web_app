import React from "react";
import { clsx } from "clsx";

import PNL from "@components/PNL";
import formatBugNumbers from "@utils/formatBigNumbers";
import { Token } from "@apis/wallet.ts";
import classes from "./styles.module.css";

type Props = {
  token: Token;
};

const ExchangeToken: React.FC<Props> = ({ token }) => {
  const {
    value,
    marketCap,
    pnl,
    amount,
    metadata: { name, symbol, imageUrl },
  } = token;

  return (
    <li className={classes.token}>
      <div className={classes.title}>
        <div className={classes.nameContainer}>
          <div className={classes.avatar}>
            {imageUrl ? (
              <img src={imageUrl} alt={symbol} />
            ) : (
              name[0].toUpperCase()
            )}
          </div>
          <span className={classes.name}>{name}</span>
        </div>
        <span className={classes.cap}>${marketCap ? formatBugNumbers(marketCap) : "Unknown"}</span>
      </div>
      <div className={classes.info}>
        <div className={classes.column}>
          <div className={classes.title}>Value</div>
          <span>{formatBugNumbers(value || 0)} SOL</span>
        </div>
        <PNL pnl={pnl} />
        <div className={clsx(classes.column, classes.alignRight)}>
          <div className={classes.title}>Amount</div>
          <span>
            {amount ? `${formatBugNumbers(amount)} ${symbol}` : "Unknown"}
          </span>
        </div>
      </div>
    </li>
  );
};

export default ExchangeToken;
