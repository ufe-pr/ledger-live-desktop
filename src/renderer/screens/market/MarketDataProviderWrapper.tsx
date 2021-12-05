// @flow
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
// @ts-expect-error error
// $FlowFixMe
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { MarketDataProvider } from "./MarketDataProvider";

type Props = {
  children: React.ReactNode;
};

export default function MarketDataProviderWrapper({ children }: Props): ReactElement {
  const counterValueCurrency: any = useSelector(counterValueCurrencySelector);

  return <MarketDataProvider countervalue={counterValueCurrency}>{children}</MarketDataProvider>;
}