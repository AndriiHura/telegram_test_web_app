import React from "react";
import { useLocation } from "wouter";
import { clsx } from "clsx";

import formatBugNumbers from "@utils/formatBigNumbers";
import { Transaction } from "@stores/WalletStore";
import PNL from "@components/PNL";

import classes from "../styles.module.css";

type Props = {
  transaction: Transaction;
};

const WalletTransactionItem: React.FC<Props> = ({ transaction }) => {
  const [, setLocation] = useLocation()
  const { value, marketCap, pnl, amount, metadata } = transaction;
  const { name, symbol, imageUrl } = metadata;

  const goToExchange = () => {
    setLocation(`/exchange/${transaction.id}`);
  };

  return (
    <li className={classes.transaction}>
      <h3 className={classes.title}>
        <div className={classes.nameContainer}>
          <div className={classes.avatar}>
            {imageUrl ? (
              <img src={imageUrl} alt={symbol} />
            ) : (
              name[0].toUpperCase()
            )}
          </div>
          <button
            className={classes.name}
            onClick={goToExchange}
          >
            {name}
          </button>
        </div>

        <span className={classes.cap}>${formatBugNumbers(marketCap || 0)}</span>
      </h3>
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

export default WalletTransactionItem;
