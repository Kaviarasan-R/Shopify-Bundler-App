import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useNavigate } from "@shopify/app-bridge-react";

export function useBundleRuleFormSubmission() {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  function checkObjectValuesNotEmpty(obj) {
    const allowedKeys = ["id", "discount_value", "min_price", "max_price"];

    return Object.entries(obj).every(
      ([key, value]) =>
        allowedKeys.includes(key) ||
        (!!value && !Array.isArray(value)) ||
        (Array.isArray(value) && value.length > 0)
    );
  }

  const onSave = async (props) => {
    const {
      bundleRuleName,
      selectedProductTags,
      selectedDiscountType,
      selectedDiscountValue,
      bundleRuleTotalProducts,
      bundleRuleMinimumPrice,
      bundleRuleMaximumPrice,
      setToastError,
      setToastMessage,
      toggleToast,
      toastError,
      editBundleRule,
      editBundleRuleId,
    } = props;

    const saveProduct = {
      id: editBundleRuleId,
      name: bundleRuleName,
      tags: selectedProductTags,
      discount_type: selectedDiscountType[0],
      discount_value: Number(selectedDiscountValue),
      total_products: Number(bundleRuleTotalProducts),
      min_price: Number(bundleRuleMinimumPrice),
      max_price: Number(bundleRuleMaximumPrice),
    };

    if (checkObjectValuesNotEmpty(saveProduct)) {
      const url = editBundleRule
        ? "/api/bundles/rules/edit"
        : "/api/bundles/rules/create";
      await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveProduct),
      })
        .then((res) => res.json())
        .then((data) => {
          setToastError(!data.status);
          setToastMessage(data.message);
          toggleToast();
        })
        .then(() => {
          if (!toastError) {
            navigate("/");
          }
        })
        .catch((err) => {
          setToastError(true);
          setToastMessage("Unable to create bundle rule");
          toggleToast();
        });
    } else {
      setToastError(true);
      setToastMessage("Please fill all required fields");
      toggleToast();
    }
  };
  return onSave;
}
