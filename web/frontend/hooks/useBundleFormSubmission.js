import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useNavigate } from "@shopify/app-bridge-react";

export function useBundleFormSubmission() {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  function checkObjectValuesNotEmpty(obj) {
    const allowedKeys = [
      "discountValue",
      "price",
      "comparedAtPrice",
      "totalBundlePrice",
      "savedBundlePrice",
      "performance",
      "productId",
      "bundleId",
    ];

    return Object.entries(obj).every(
      ([key, value]) =>
        allowedKeys.includes(key) ||
        (!!value && !Array.isArray(value)) ||
        (Array.isArray(value) && value.length > 0)
    );
  }

  const onSave = async (props) => {
    const {
      bundleId,
      bundleName,
      bundleTitle,
      bundleDescription,
      selectedBundleStatus,
      renderSelectedItems,
      selectedDiscountType,
      selectedDiscountValue,
      renderTotalBundlePrice,
      totalBundlePrice,
      totalSavedBundlePrice,
      performance,
      setToastError,
      setToastMessage,
      toggleToast,
      toastError,
      editBundle,
      editBundleId,
    } = props;

    const saveProduct = {
      bundleId: bundleId,
      productId: editBundle ? `gid://shopify/Product/${editBundleId}` : "",
      name: bundleName,
      title: bundleTitle,
      description: bundleDescription,
      productType: "Bundle",
      vendor: "Bundler",
      status: selectedBundleStatus == "Active" ? "ACTIVE" : "DRAFT",
      media: renderSelectedItems.map((data) => data.url),
      selectedProducts: renderSelectedItems,
      discountType: selectedDiscountType,
      discountValue: selectedDiscountValue, // Applied discount %, ₹
      price: renderTotalBundlePrice, // Price after discounts applied
      /* Price before discounts applied, it can be higher only when set price 
        is set to higher than original total price*/
      comparedAtPrice:
        totalBundlePrice > renderTotalBundlePrice ? totalBundlePrice : 0,
      totalBundlePrice: totalBundlePrice, // Original total price
      savedBundlePrice: totalSavedBundlePrice, // Saved amount after discounts applied
      performance: editBundle ? performance : 0,
    };

    if (checkObjectValuesNotEmpty(saveProduct)) {
      const url = editBundle ? "/api/bundles/edit" : "/api/bundles/create";
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
          if (!toastError) {
            navigate("/home");
          }
        })
        .catch((err) => {
          setToastError(true);
          setToastMessage(
            editBundle ? "Unable to edit bundle" : "Unable to create bundle"
          );
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
