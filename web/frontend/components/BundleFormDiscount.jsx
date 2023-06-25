import { Box, ChoiceList, TextField } from "@shopify/polaris";
import { useCallback } from "react";

export function BundleFormDiscount(props) {
  const {
    selectedDiscountType,
    setSelectedDiscountType,
    selectedDiscountValue,
    setSelectedDiscountValue,
  } = props;

  const handleDiscountTypeChange = useCallback(
    (value) => setSelectedDiscountType(value),
    []
  );

  const handleDiscountValueChange = useCallback((value) => {
    if (!isNaN(value) && value >= 0) {
      const sanitizedValue = value.replace(/^0+/, "");
      setSelectedDiscountValue(sanitizedValue);
    }
  }, []);

  return (
    <>
      <p className='bundle--form--description'>
        Choose type of discount and discount value for each product.
      </p>
      <Box paddingBlockStart='3'>
        <ChoiceList
          title='Discount'
          titleHidden
          choices={[
            {
              label: "Percentage discount",
              value: "percentageDiscount",
            },
            { label: "Fixed discount", value: "fixedDiscount" },
            { label: "Set price", value: "setPrice" },
            { label: "No discount", value: "noDiscount" },
          ]}
          selected={selectedDiscountType}
          onChange={handleDiscountTypeChange}
        />
      </Box>
      <Box paddingBlockStart='3'>
        {selectedDiscountType[0] != "noDiscount" ? (
          <TextField
            label={
              selectedDiscountType[0] === "setPrice"
                ? "Price"
                : "Discount value"
            }
            type='number'
            value={selectedDiscountValue}
            onChange={handleDiscountValueChange}
            suffix={
              selectedDiscountType[0] === "percentageDiscount" ? "%" : "₹"
            }
            autoComplete='off'
          />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

export default BundleFormDiscount;
