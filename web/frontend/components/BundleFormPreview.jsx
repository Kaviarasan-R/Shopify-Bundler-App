import {
  HorizontalStack,
  VerticalStack,
  Box,
  Icon,
  Text,
  Button,
} from "@shopify/polaris";
import { CirclePlusMajor } from "@shopify/polaris-icons";
import { useEffect } from "react";
import "../assets/styles.css";

export function BundleFormPreview(props) {
  const {
    totalBundlePrice,
    setTotalBundlePrice,
    totalSavedBundlePrice,
    setTotalSavedBundlePrice,
    renderTotalBundlePrice,
    setRenderTotalBundlePrice,
    renderSelectedItems,
    selectedDiscountType,
    selectedDiscountValue,
    browseActive,
    bundleTitle,
  } = props;

  const renderBundlePreview = [];

  useEffect(() => {
    const sumBundlePrice = renderSelectedItems.reduce(
      (acc, obj) => acc + Number(obj.price),
      0
    );
    setTotalBundlePrice(sumBundlePrice);
    setRenderTotalBundlePrice(sumBundlePrice);
  }, [renderSelectedItems]);

  useEffect(() => {
    const discValue = Number(selectedDiscountValue);
    if (selectedDiscountType[0] === "percentageDiscount") {
      const disc =
        totalBundlePrice * (Number(discValue > 100 ? 100 : discValue) / 100);
      setTotalSavedBundlePrice(Math.round(disc));
      setRenderTotalBundlePrice(Math.round(totalBundlePrice - disc));
    } else if (selectedDiscountType[0] === "fixedDiscount") {
      const disc =
        totalBundlePrice >= discValue ? totalBundlePrice - discValue : 0;
      setTotalSavedBundlePrice(
        Math.round(discValue > totalBundlePrice ? totalBundlePrice : discValue)
      );
      setRenderTotalBundlePrice(Math.round(disc));
    } else if (selectedDiscountType[0] === "setPrice") {
      setTotalSavedBundlePrice(
        discValue > totalBundlePrice ? 0 : totalBundlePrice - discValue
      );
      setRenderTotalBundlePrice(discValue);
    } else {
      setRenderTotalBundlePrice(totalBundlePrice);
      setTotalSavedBundlePrice(0);
    }
  }, [
    selectedDiscountValue,
    selectedDiscountType,
    renderSelectedItems,
    totalBundlePrice,
    totalSavedBundlePrice,
  ]);

  renderSelectedItems.forEach((data, index) => {
    renderBundlePreview.push(
      <div key={index}>
        <HorizontalStack gap='10' blockAlign='center'>
          <img src={data.url} alt={data.title} width={80} height={80} />
          <VerticalStack gap='6'>
            <h1 style={{ fontSize: "16px" }}>
              {data.title.length > 15
                ? `${data.title.slice(0, 15)}...`
                : data.title}
            </h1>
            <h1 style={{ fontSize: "16px" }} className='grey--color'>
              ₹{data.price}
            </h1>
          </VerticalStack>
        </HorizontalStack>
        {index + 1 != renderSelectedItems.length ? (
          <Box padding='6'>
            <Icon source={CirclePlusMajor} />
          </Box>
        ) : (
          ""
        )}
      </div>
    );
  });

  return (
    <>
      {renderSelectedItems.length > 0 && !browseActive ? (
        <>
          <Text
            variant='headingMd'
            as='h5'
            alignment='start'
            fontWeight='medium'
          >
            {bundleTitle}
          </Text>
          <Box paddingBlockStart='6'>{renderBundlePreview}</Box>
          <br />
          <HorizontalStack align='space-between'>
            <h1 style={{ fontSize: "16px" }}>Total</h1>
            {(selectedDiscountValue == 0 ||
              selectedDiscountType[0] === "noDiscount") &&
              selectedDiscountType[0] !== "setPrice" && (
                <h1 style={{ fontSize: "16px" }} className='green--color'>
                  ₹{totalBundlePrice}
                </h1>
              )}
            {renderTotalBundlePrice < totalBundlePrice && (
              <h1
                style={{ fontSize: "16px" }}
                className={`${
                  totalBundlePrice > renderTotalBundlePrice
                    ? "red--color strike--through"
                    : "green--color"
                }`}
              >
                ₹{totalBundlePrice}
              </h1>
            )}
            {renderTotalBundlePrice < totalBundlePrice && (
              <h1
                style={{ fontSize: "16px" }}
                className={`${
                  renderTotalBundlePrice <= totalBundlePrice
                    ? "green--color"
                    : "red--color"
                }`}
              >
                ₹{renderTotalBundlePrice}
              </h1>
            )}
            {selectedDiscountType[0] === "setPrice" &&
              renderTotalBundlePrice > totalBundlePrice && (
                <h1 style={{ fontSize: "16px" }} className='green--color'>
                  ₹{selectedDiscountValue}
                </h1>
              )}
          </HorizontalStack>

          {totalSavedBundlePrice > 0 && (
            <Box paddingBlockStart='6'>
              <Button fullWidth primary>
                Save ₹{totalSavedBundlePrice}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <p className='bundle--form--description'>
          Please add products to see the bundle preview
        </p>
      )}
    </>
  );
}

export default BundleFormPreview;
