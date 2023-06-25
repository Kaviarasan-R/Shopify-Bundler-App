import { Box, HorizontalStack, Spinner, Text, Tooltip } from "@shopify/polaris";
import {
  MainTab,
  BundleAnalyticsDateRange,
  BundleAnalyticsDataTable,
} from "../components";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";

export default function Analytics() {
  const fetch = useAuthenticatedFetch();
  const options = { day: "numeric", month: "short", year: "numeric" };

  /* STATES */
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [orderData, setOrderData] = useState([]);
  const [totalBundles, setTotalBundles] = useState(0);
  const [totalBundlesSold, setTotalBundlesSold] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [bundlesTotalSalesValue, setBundlesTotalSalesValue] = useState(0);
  const [ordersTotalSalesValue, setOrdersTotalSalesValue] = useState(0);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  /* HANDLES */
  const handleSelectedFromDate = (date) => {
    const maximumDate = new Date(selectedToDate);
    maximumDate.setHours(23, 59, 59, 999);

    if (date > maximumDate) {
      setSelectedFromDate(maximumDate);
    } else {
      setSelectedFromDate(date);
    }
  };

  const handleSelectedToDate = (date) => {
    const minimumDate = new Date(selectedFromDate);
    minimumDate.setHours(0, 0, 0, 0);

    if (date < minimumDate) {
      setSelectedToDate(minimumDate);
    } else {
      setSelectedToDate(date);
    }
  };

  /* API REQUEST */

  useEffect(async () => {
    setIsFetchingOrders(true);
    await fetch("/api/orders/fetch", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedFromDate, selectedToDate }),
    })
      .then((res) => res.json())
      .then((res) => {
        setTotalBundles(res.totalBundles);
        setTotalBundlesSold(res.totalBundlesSold);
        setTotalOrders(res.totalOrders);
        setBundlesTotalSalesValue(res.bundlesTotalSalesValue);
        setOrdersTotalSalesValue(res.ordersTotalSalesValue);
        setTotalSalesValue(res.totalSalesValue);
        setOrderData(() => [
          ...res.order.map((order) => [
            order.name,
            new Date(order.createdAt).toLocaleDateString("en-US", options),

            <Tooltip content={order.title}>
              <Text>
                {order.title.length > 15
                  ? `${order.title.slice(0, 15)}...`
                  : order.title}
              </Text>
            </Tooltip>,

            order.customer,
            order.items,
            order.bundles_total_sales_value,
            order.orders_total_sales_value,
            order.total_sales_value,
          ]),
        ]);
      });
    setIsFetchingOrders(false);
    return () => {};
  }, [selectedFromDate, selectedToDate]);

  return (
    <>
      <MainTab />
      <Box padding='6'>
        <HorizontalStack align='space-between'>
          <Text variant='headingXl' as='h4'>
            Analytics
          </Text>
        </HorizontalStack>
        <Box paddingBlockStart='4'>
          <HorizontalStack gap='6'>
            <BundleAnalyticsDateRange
              selectedDate={selectedFromDate}
              setSelectedDate={handleSelectedFromDate}
              minimumDate={selectedToDate}
            />
            <BundleAnalyticsDateRange
              selectedDate={selectedToDate}
              setSelectedDate={handleSelectedToDate}
              maximumDate={selectedFromDate}
            />
          </HorizontalStack>
        </Box>
        <BundleAnalyticsDataTable
          data={orderData}
          totalBundles={totalBundles}
          totalBundlesSold={totalBundlesSold}
          totalOrders={totalOrders}
          bundlesTotalSalesValue={bundlesTotalSalesValue}
          ordersTotalSalesValue={ordersTotalSalesValue}
          totalSalesValue={totalSalesValue}
          isFetchingOrders={isFetchingOrders}
        />
      </Box>
    </>
  );
}
