import {
  Link,
  Page,
  LegacyCard,
  Box,
  DataTable,
  Text,
  Grid,
  Spinner,
  HorizontalStack,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export function BundleAnalyticsDataTable(props) {
  const { totalBundles, totalBundlesSold, totalOrders } = props;
  const bundleOrderTitleDetails = [
    "Number of bundles",
    "Number of sold bundles",
    "Number of orders that include bundles",
  ];
  const bundleOrderDetails = [totalBundles, totalBundlesSold, totalOrders];
  const [sortedRows, setSortedRows] = useState(null);
  const rows = sortedRows ? sortedRows : props.data;
  const handleSort = useCallback(
    (index, direction) => setSortedRows(sortValue(rows, index, direction)),
    [rows]
  );
  function sortValue(rows, index, direction) {
    return [...rows].sort((rowA, rowB) => {
      const amountA = parseFloat((rowA[index] || 0).toString().substring(1));
      const amountB = parseFloat((rowB[index] || 0).toString().substring(1));

      return direction === "descending" ? amountB - amountA : amountA - amountB;
    });
  }
  return (
    <>
      <Box paddingBlockStart='6' paddingBlockEnd='6'>
        <Grid>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Grid.Cell
                columnSpan={{ xs: 6, sm: 6, md: 3, lg: 4, xl: 4 }}
                key={index}
              >
                <LegacyCard>
                  <Box padding='6'>
                    <Text>{bundleOrderTitleDetails[index]}</Text>
                    <div style={{ height: 10 }}></div>
                    <Text color='success' variant='headingLg' as='h5'>
                      {bundleOrderDetails[index]}
                    </Text>
                  </Box>
                </LegacyCard>
              </Grid.Cell>
            ))}
        </Grid>
      </Box>
      <LegacyCard>
        {props.isFetchingOrders ? (
          <Box padding='6'>
            <HorizontalStack align='center'>
              <Spinner accessibilityLabel='Spinner example' size='small' />
            </HorizontalStack>
          </Box>
        ) : (
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "text",
              "number",
              "number",
              "number",
              "number",
            ]}
            headings={[
              "Order",
              "Order Date",
              "Product Title",
              "Customer",
              "Items",
              "Bundle Value(PAD + PBT)",
              "Order Value(PAD + PAT)",
              "Total Value(PBD + PBT)",
            ]}
            rows={rows}
            totals={[
              "",
              "",
              "",
              "",
              "",
              props.bundlesTotalSalesValue,
              props.ordersTotalSalesValue,
              props.totalSalesValue,
            ]}
            sortable={[false, false, false, false, false, true, true, true]}
            defaultSortDirection='descending'
            onSort={handleSort}
            hideScrollIndicator
            hasZebraStripingOnData
            increasedTableDensity
          />
        )}
      </LegacyCard>
    </>
  );
}
