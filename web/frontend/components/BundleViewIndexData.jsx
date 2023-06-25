import {
  IndexTable,
  useIndexResourceState,
  Link,
  Badge,
  HorizontalStack,
  EmptySearchResult,
} from "@shopify/polaris";

import { BundleViewProductPopover } from "./BundleViewProductPopover";

import { useNavigate, Toast } from "@shopify/app-bridge-react";

import { useAuthenticatedFetch } from "../hooks";

import { useState, useCallback, useEffect } from "react";

import "../assets/styles.css";

export function BundleViewIndexData(props) {
  const {
    bundles,
    startIndex,
    endIndex,
    totalBundleItems,
    popoverActive,
    setPopoverActive,
    bundleIndex,
    setBundleIndex,
  } = props;

  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleToast = useCallback(() => {
    setShowToast((prev) => !prev);
  }, []);

  const dynamicToast = toastError ? (
    <Toast content={toastMessage} error onDismiss={toggleToast} />
  ) : (
    <Toast content={toastMessage} onDismiss={toggleToast} />
  );
  const toastMarkup = showToast ? dynamicToast : null;

  const resourceName = {
    singular: "Bundle",
    plural: "Bundles",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(bundles);

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No bundles found"}
      description={"Try creating new bundle or with different filters"}
      withIllustration
    />
  );

  /* DELETE */
  const onDelete = async () => {
    const deleteIds = selectedResources.map((index) => {
      const bundle = bundles.find((data) => data.id === index);
      return bundle.product_id;
    });

    await fetch("/api/bundles/delete", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteIds),
    })
      .then((res) => res.json())
      .then((res) => {
        setToastError(!res.success);
        setToastMessage("Successfully Deleted");
        toggleToast();
        if (!toastError) {
          navigate("/home");
        }
      })
      .catch((err) => {
        setToastError(data.status);
        setToastMessage("Unable to delete the selected bundles");
        toggleToast();
      });
  };

  const promotedBulkActions = [
    {
      content: "Delete Bundle",
      onAction: () => onDelete(),
    },
  ];

  const handleRowClick = (productId) => {
    const redirectUrl = "/createbundleform";
    navigate(`${redirectUrl}?productId=${productId.split("/").slice(-1)}`);
  };

  const rowMarkup = bundles
    ?.slice(startIndex, endIndex)
    .map(
      (
        {
          id,
          product_id,
          products,
          name,
          discount_type,
          discount_value,
          total_product_price,
          status,
          performance,
        },
        index
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <HorizontalStack
              className='horizontal--stack--bundled-items'
              gap='1'
            >
              {products?.map((data, idx) => (
                <img
                  src={data.image}
                  alt={data.title}
                  key={idx}
                  className='bundle--item--display'
                />
              ))}

              <div>
                <BundleViewProductPopover
                  popoverActive={popoverActive}
                  setPopoverActive={setPopoverActive}
                  bundles={bundles}
                  bundleIndex={bundleIndex}
                  setBundleIndex={setBundleIndex}
                  startIndex={startIndex}
                  index={index}
                />
              </div>
            </HorizontalStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Link onClick={() => handleRowClick(product_id)}>{name}</Link>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {discount_type === "percentageDiscount"
              ? discount_value > 100
                ? "100 %"
                : discount_value + " %"
              : discount_type === "fixedDiscount"
              ? discount_value > total_product_price
                ? "₹ " + total_product_price
                : "₹ " + discount_value
              : discount_type === "setPrice"
              ? discount_value > total_product_price
                ? 0
                : "₹ " + discount_value
              : 0}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {status === "ACTIVE" ? (
              <Badge status='success'>Active</Badge>
            ) : (
              <Badge status='info'>Draft</Badge>
            )}
          </IndexTable.Cell>
          <IndexTable.Cell>Bundle</IndexTable.Cell>
          <IndexTable.Cell>
            <Badge progress='complete'>Enabled</Badge>
          </IndexTable.Cell>
          <IndexTable.Cell>{performance} Sold</IndexTable.Cell>
        </IndexTable.Row>
      )
    );

  return (
    <>
      <IndexTable
        resourceName={resourceName}
        itemCount={totalBundleItems}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        emptyState={emptyStateMarkup}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Bundled Items" },
          { title: "Name" },
          { title: "Discount" },
          { title: "Status" },
          { title: "Type" },
          { title: "Bundle as a product" },
          { title: "Performance" },
        ]}
        promotedBulkActions={promotedBulkActions}
      >
        {rowMarkup}
      </IndexTable>
      {toastMarkup}
    </>
  );
}

export default BundleViewIndexData;
