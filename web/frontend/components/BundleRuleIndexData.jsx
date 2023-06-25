import {
  IndexTable,
  useIndexResourceState,
  Tag,
  HorizontalStack,
  Button,
  Spinner,
  Link,
  EmptySearchResult,
} from "@shopify/polaris";

import { useNavigate, Toast } from "@shopify/app-bridge-react";

import { useAuthenticatedFetch, useGenerateBundle } from "../hooks";

import { useState, useCallback } from "react";

import "../assets/styles.css";

export function BundleRuleIndexData(props) {
  const { bundleRules, startIndex, endIndex, totalBundleRuleItems } = props;
  const onGenerate = useGenerateBundle();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const [generatingStates, setGeneratingStates] = useState(
    bundleRules.map(() => false)
  );
  /* TOAST FOR DELETE */

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
    useIndexResourceState(bundleRules);

  /* DELETE */

  const onDelete = async () => {
    const deleteIds = selectedResources.map((index) => {
      const bundleRulesId = bundleRules.find((data) => data.id === index);
      return bundleRulesId.id;
    });

    await fetch("/api/bundles/rules/delete", {
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
      content: "Delete Bundle Rule",
      onAction: () => onDelete(),
    },
  ];

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No bundle rules found"}
      description={"Try creating new bundle rules"}
      withIllustration
    />
  );

  const handleRowClick = (id) => {
    const redirectUrl = "/createbundlerule";
    navigate(`${redirectUrl}?id=${id}`);
  };

  function replaceDiscountType(discountType) {
    const replacements = {
      percentageDiscount: "Percentage Discount",
      fixedDiscount: "Fixed Discount",
      setPrice: "Set Price",
      noDiscount: "No Discount",
    };

    return replacements[discountType] || discountType;
  }

  /* GENERATE BUNDLE */
  const handleGenerateBundle = async (index) => {
    const newGeneratingStates = [...generatingStates];
    newGeneratingStates[index] = true;
    setGeneratingStates(newGeneratingStates);

    const props = {
      selectedProductTags: bundleRules[index].tags,
      bundleRuleTotalProducts: bundleRules[index].total_products,
      bundleRuleMinimumPrice: bundleRules[index].min_price,
      bundleRuleMaximumPrice: bundleRules[index].max_price,
      selectedDiscountType: bundleRules[index].discount_type,
      selectedDiscountValue: bundleRules[index].discount_value,
      toastError,
      setToastError,
      setToastMessage,
      toggleToast,
    };
    await onGenerate(props)
      .then(() => {
        newGeneratingStates[index] = false;
        setGeneratingStates(newGeneratingStates);
      })
      .catch((error) => {
        // Handle error if needed
        console.error(error);
      });
  };

  const rowMarkup = bundleRules
    ?.slice(startIndex, endIndex)
    .map(
      (
        {
          id,
          name,
          tags,
          discount_type,
          discount_value,
          total_products,
          min_price,
          max_price,
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
            <Link onClick={() => handleRowClick(id)}>{name}</Link>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <HorizontalStack gap='1' wrap={true}>
              {tags.map((data, idx) => (
                <Tag key={idx}>{data}</Tag>
              ))}
            </HorizontalStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {replaceDiscountType(discount_type)}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {discount_type === "percentageDiscount"
              ? discount_value > 100
                ? "100 %"
                : discount_value + " %"
              : discount_type === "fixedDiscount"
              ? "₹ " + discount_value
              : discount_type === "setPrice"
              ? "₹ " + discount_value
              : 0}
          </IndexTable.Cell>
          <IndexTable.Cell>{total_products}</IndexTable.Cell>
          <IndexTable.Cell>{min_price}</IndexTable.Cell>
          <IndexTable.Cell>{max_price}</IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              primary
              loading={generatingStates[startIndex + index]}
              onClick={() => handleGenerateBundle(startIndex + index)}
            >
              {generatingStates[startIndex + index] ? (
                <Spinner size='small' color='white' />
              ) : (
                "Generate"
              )}
            </Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );

  return (
    <>
      <IndexTable
        resourceName={resourceName}
        itemCount={totalBundleRuleItems}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        emptyState={emptyStateMarkup}
        headings={[
          { title: "Name" },
          { title: "Tags" },
          { title: "Discount Type" },
          { title: "Discount Value" },
          { title: "Total Products" },
          { title: "Minimum Price" },
          { title: "Maximum Price" },
          { title: "Generate" },
        ]}
        promotedBulkActions={promotedBulkActions}
      >
        {rowMarkup}
      </IndexTable>
      {toastMarkup}
    </>
  );
}

export default BundleRuleIndexData;
