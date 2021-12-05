import React, { useMemo, useCallback } from "react";
import { Flex, Text, Icons } from "@ledgerhq/react-ui";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { starredMarketCoinsSelector, localeSelector } from "~/renderer/reducers/settings";
import { useSingleCoinMarketData } from "../MarketDataProvider";
import styled, { useTheme } from "styled-components";
import CounterValueSelect from "../CountervalueSelect";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { addStarredMarketCoins, removeStarredMarketCoins } from "~/renderer/actions/settings";
import { Button } from "..";
import MarketCoinChart from "./MarketCoinChart";
import MarketInfo from "./MarketInfo";

const CryptoCurrencyIconWrapper = styled.div`
  height: 56px;
  width: 56px;
  position: relative;
  border-radius: 56px;
  overflow: hidden;
  img {
    object-fit: cover;
  }
`;

const Container = styled(Flex).attrs({
  flex: "1",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
})``;

const Title = styled(Text).attrs({ variant: "h3" })`
  font-size: 28px;
  line-height: 33px;
`;

export default function MarketCoinScreen() {
  const { t } = useTranslation();
  const history = useHistory();
  const { currencyId } = useParams();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const starredMarketCoins: string[] = useSelector(starredMarketCoinsSelector);
  const isStarred = starredMarketCoins.includes(currencyId);
  const locale = useSelector(localeSelector);

  const {
    selectedCoinData: currency,
    chartRequestParams,
    loading,
    loadingChart,
    error,
    counterCurrency,
    refreshChart,
  } = useSingleCoinMarketData(currencyId);

  const {
    id,
    ticker,
    name,
    image,
    marketcap,
    marketcapRank,
    totalVolume,
    high24h,
    low24h,
    marketCapChangePercentage24h,
    circulatingSupply,
    totalSupply,
    maxSupply,
    ath,
    athDate,
    atl,
    atlDate,
    price,
    priceChangePercentage,
    internalCurrency,
    chartData,
  } = currency || {};

  const color = internalCurrency
    ? getCurrencyColor(internalCurrency, colors.background.main)
    : colors.primary.c80;

  const onBuy = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("market page");
      history.push({
        pathname: "/exchange",
        state: {
          defaultCurrency: internalCurrency,
        },
      });
    },
    [internalCurrency, history],
  );

  const onSwap = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setTrackingSource("market page");
      history.push({
        pathname: "/swap",
        state: {
          defaultCurrency: internalCurrency,
        },
      });
    },
    [internalCurrency, history],
  );

  const toggleStar = useCallback(() => {
    if (isStarred) {
      dispatch(removeStarredMarketCoins(id));
    } else {
      dispatch(addStarredMarketCoins(id));
    }
  }, [dispatch, isStarred, id]);

  return currency ? (
    <Container>
      <Flex flexDirection="row" pr="6px" my={2} alignItems="center" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-start">
          <CryptoCurrencyIconWrapper>
            {internalCurrency ? (
              <CryptoCurrencyIcon
                currency={internalCurrency}
                size={56}
                circle
                fallback={<img width="56px" height="56px" src={image} alt={"currency logo"} />}
              />
            ) : (
              <img width="56px" height="56px" src={image} alt={"currency logo"} />
            )}
          </CryptoCurrencyIconWrapper>
          <Flex pl={3} flexDirection="column" alignItems="left" pr={16}>
            <Flex flexDirection="row" alignItems="center">
              <Title>{name}</Title>
              <Button
                height="33"
                ml={2}
                p={1}
                onClick={toggleStar}
                Icon={isStarred ? Icons.StarSolidRegular : Icons.StarRegular}
              />
            </Flex>
            <Text variant="small" color="neutral.c60">
              {ticker.toUpperCase()}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          {internalCurrency && (
            <>
              {isCurrencySupported("BUY", internalCurrency) && (
                <Button variant="main" big mr={20} px={4} onClick={onBuy}>
                  {t("accounts.contextMenu.buy")}
                </Button>
              )}
              {isCurrencySupported("SELL", internalCurrency) && (
                <Button variant="main" big px={4} onClick={onSwap}>
                  {t("accounts.contextMenu.swap")}
                </Button>
              )}
            </>
          )}
          <CounterValueSelect />
        </Flex>
      </Flex>
      <MarketCoinChart
        price={price}
        priceChangePercentage={priceChangePercentage}
        chartData={chartData}
        chartRequestParams={chartRequestParams}
        refreshChart={refreshChart}
        color={color}
        t={t}
        locale={locale}
        loading={loadingChart}
      />
      <MarketInfo
        marketcap={marketcap}
        marketcapRank={marketcapRank}
        totalVolume={totalVolume}
        high24h={high24h}
        low24h={low24h}
        price={price}
        priceChangePercentage={priceChangePercentage}
        marketCapChangePercentage24h={marketCapChangePercentage24h}
        circulatingSupply={circulatingSupply}
        totalSupply={totalSupply}
        maxSupply={maxSupply}
        ath={ath}
        athDate={athDate}
        atl={atl}
        atlDate={atlDate}
        locale={locale}
        counterCurrency={counterCurrency}
        loading={loading}
      />
    </Container>
  ) : null;
}