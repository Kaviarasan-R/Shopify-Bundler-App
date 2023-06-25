import {
  uniqueNamesGenerator,
  adjectives,
  names,
  NumberDictionary,
  countries,
  starWars,
} from "unique-names-generator";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useNavigate } from "@shopify/app-bridge-react";
import { useBundleFormSubmission } from "./useBundleFormSubmission";

export function useGenerateBundle() {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const onSave = useBundleFormSubmission();

  const numberDictionary = NumberDictionary.generate({ min: 1, max: 999 });

  const bundleName = uniqueNamesGenerator({
    dictionaries: [adjectives, names, numberDictionary],
    length: 3,
    separator: " ",
    style: "capital",
  });

  const bundleTitle = uniqueNamesGenerator({
    dictionaries: [adjectives, names, adjectives, names, adjectives, names],
    length: 6,
    separator: " ",
    style: "capital",
  });

  const bundleDescription = uniqueNamesGenerator({
    dictionaries: [
      adjectives,
      names,
      countries,
      starWars,
      adjectives,
      names,
      countries,
      starWars,
      adjectives,
      names,
      countries,
      starWars,
    ],
    length: 12,
    separator: " ",
    style: "lowerCase",
  });

  const onGenerate = async (props) => {
    const {
      selectedProductTags,
      bundleRuleTotalProducts,
      bundleRuleMinimumPrice,
      bundleRuleMaximumPrice,
      selectedDiscountType,
      selectedDiscountValue,
      toastError,
      setToastError,
      setToastMessage,
      toggleToast,
    } = props;
    const discValue = Number(selectedDiscountValue);
    let totalBundlePrice = 0;
    let totalSavedBundlePrice = 0;
    let renderTotalBundlePrice = 0;

    const fetchProduct = {
      tags: selectedProductTags,
      total_products: Number(bundleRuleTotalProducts),
      min_price: Number(bundleRuleMinimumPrice),
      max_price: Number(bundleRuleMaximumPrice),
    };

    const url = "/api/bundles/rules/generate";
    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        totalBundlePrice = data.result.reduce((total, product) => {
          const price = Number(product.price);
          return total + price;
        }, 0);
        if (selectedDiscountType === "percentageDiscount") {
          const disc =
            totalBundlePrice *
            (Number(discValue > 100 ? 100 : discValue) / 100);
          totalSavedBundlePrice = Math.round(disc);
          renderTotalBundlePrice = Math.round(totalBundlePrice - disc);
        } else if (selectedDiscountType === "fixedDiscount") {
          const disc =
            totalBundlePrice >= discValue ? totalBundlePrice - discValue : 0;
          totalSavedBundlePrice = Math.round(
            discValue > totalBundlePrice ? totalBundlePrice : discValue
          );
          renderTotalBundlePrice = Math.round(disc);
        } else if (selectedDiscountType === "setPrice") {
          totalSavedBundlePrice =
            discValue > totalBundlePrice ? 0 : totalBundlePrice - discValue;
          renderTotalBundlePrice = discValue;
        } else {
          renderTotalBundlePrice = totalBundlePrice;
          totalSavedBundlePrice = 0;
        }
        const props = {
          bundleId: "",
          bundleName: bundleName,
          bundleTitle: bundleTitle,
          bundleDescription: bundleDescription,
          selectedBundleStatus: "Active",
          renderSelectedItems: data.result,
          selectedDiscountType: selectedDiscountType,
          selectedDiscountValue: selectedDiscountValue,
          renderTotalBundlePrice: renderTotalBundlePrice,
          totalBundlePrice: totalBundlePrice,
          totalSavedBundlePrice: totalSavedBundlePrice,
          performance: 0,
          setToastError,
          setToastMessage,
          toggleToast,
          toastError,
          editBundle: false,
          editBundleId: "",
        };
        if (data.result.length > 0) {
          onSave(props);
        } else {
          setToastError(true);
          setToastMessage("No products satisfies the rule.");
          toggleToast();
        }
      })
      .catch((err) => {
        setToastError(true);
        setToastMessage("Unable to generate bundle");
        toggleToast();
      });
  };
  return onGenerate;
}
