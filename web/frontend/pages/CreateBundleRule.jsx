import {
  Frame,
  ContextualSaveBar,
  Box,
  Text,
  Icon,
  Button,
  HorizontalStack,
  TextField,
  LegacyCard,
} from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Toast } from "@shopify/app-bridge-react";
import {
  useAuthenticatedFetch,
  useBundleRuleFormSubmission,
  useGenerateBundle,
} from "../hooks";
import { BundleRuleTags, BundleFormDiscount } from "../components";

export default function CreateBundleRule() {
  const onSave = useBundleRuleFormSubmission();
  const onGenerate = useGenerateBundle();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  /* STATES */

  // BUNDLE RULE NAME
  const [bundleRuleName, setBundleRuleName] = useState("");

  // BUNDLE RULE PRODUCT TAGS
  const [bundleRuleProductTags, setBundleRuleProductTags] = useState("");
  const [selectedProductTags, setSelectedProductTags] = useState([]);

  // BUNDLE RULE DISCOUNT
  const [selectedDiscountType, setSelectedDiscountType] = useState([
    "percentageDiscount",
  ]);
  const [selectedDiscountValue, setSelectedDiscountValue] = useState(0);

  // BUNDLE RULE TOTAL PRODUCTS
  const [bundleRuleTotalProducts, setBundleRuleTotalProducts] = useState(0);

  // BUNDLE RULE PRICE RANGE
  const [bundleRuleMinimumPrice, setBundleRuleMinimumPrice] = useState(0);
  const [bundleRuleMaximumPrice, setBundleRuleMaximumPrice] = useState(0);

  // EDIT
  const [editBundleRule, setEditBundleRule] = useState(false);
  const [editBundleRuleId, setEditBundleRuleId] = useState("");

  // TOAST
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* HANDLE CHANGES */

  // BUNDLE RULE NAME
  const handleBundleRuleNameChange = (value) => {
    setBundleRuleName(value);
  };

  // BUNDLE RULE TOTAL PRODUCTS
  const handleBundleRuleTotalProductsChange = useCallback((value) => {
    if (!isNaN(value) && value >= 0) {
      const sanitizedValue = value.replace(/^0+/, "");
      setBundleRuleTotalProducts(sanitizedValue);
    }
  }, []);

  // BUNDLE RULE PRICE RANGE
  const handleBundleRuleMinimumPriceChange = useCallback(
    (value) => {
      setBundleRuleMinimumPrice(value);
      if (value === "") {
        setBundleRuleMinimumPrice(0);
        return;
      }
      const sanitizedValue = value.replace(/^0+/, "");
      if (!isNaN(value) && value > 0 && value <= bundleRuleMaximumPrice) {
        setBundleRuleMinimumPrice(sanitizedValue);
      }
      if (
        !isNaN(value) &&
        value > 0 &&
        Number(value) > bundleRuleMaximumPrice
      ) {
        setBundleRuleMinimumPrice(bundleRuleMaximumPrice);
      }
    },
    [bundleRuleMaximumPrice]
  );

  const handleBundleRuleMaximumPriceChange = useCallback(
    (value) => {
      setBundleRuleMaximumPrice(value);
      if (value === "") {
        setBundleRuleMaximumPrice("0");
        return;
      }
      const numericValue = parseFloat(value);
      const sanitizedValue = isNaN(numericValue) ? "" : String(numericValue); // Convert to string to remove leading zeros
      if (
        !isNaN(numericValue) &&
        numericValue >= 0 &&
        numericValue >= bundleRuleMinimumPrice
      ) {
        setBundleRuleMaximumPrice(sanitizedValue);
      }
      if (
        !isNaN(numericValue) &&
        numericValue >= 0 &&
        numericValue < bundleRuleMinimumPrice
      ) {
        setBundleRuleMaximumPrice(bundleRuleMinimumPrice);
      }
    },
    [bundleRuleMinimumPrice]
  );

  // TOAST
  const toggleToast = useCallback(() => {
    setShowToast((prev) => !prev);
  }, []);

  const dynamicToast = toastError ? (
    <Toast content={toastMessage} error onDismiss={toggleToast} />
  ) : (
    <Toast content={toastMessage} onDismiss={toggleToast} />
  );
  const toastMarkup = showToast ? dynamicToast : null;

  /* EDIT BUNDLE RULE */
  useEffect(() => {
    const field = "id";
    const queryUrl = window.location.href;
    if (queryUrl.indexOf("?" + field + "=") != -1) {
      setEditBundleRule(true);
      setEditBundleRuleId(queryUrl.split("id=").slice(-1));
    } else {
      setEditBundleRule(false);
      setEditBundleRuleId("");
    }
  }, []);

  useEffect(async () => {
    if (editBundleRule) {
      await fetch(`/api/bundles/rules/${editBundleRuleId}`)
        .then((res) => res.json())
        .then((res) => {
          setBundleRuleName(res.bundleRule.name);
          setSelectedProductTags(res.bundleRule.tags.split(","));
          setSelectedDiscountType([res.bundleRule.discount_type]);
          setSelectedDiscountValue(Number(res.bundleRule.discount_value));
          setBundleRuleTotalProducts(Number(res.bundleRule.total_products));
          setBundleRuleMinimumPrice(Number(res.bundleRule.min_price));
          setBundleRuleMaximumPrice(Number(res.bundleRule.max_price));
        });
    }
    return () => {};
  }, [editBundleRule]);

  /* GENERATE BUNDLE */
  /* const handleGenerateBundle = async () => {
    const props = {
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
    };
    onGenerate(props);
  }; */

  // FORM SUBMISSION
  const onSaveBundleRule = () => {
    const props = {
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
    };
    onSave(props);
  };

  return (
    <Box padding='6'>
      <div style={{ height: "70px" }}>
        <Frame>
          <ContextualSaveBar
            alignContentFlush
            message='Unsaved changes'
            saveAction={{
              onAction: onSaveBundleRule,
            }}
            discardAction={{
              onAction: () => navigate("/"),
            }}
          />
        </Frame>
      </div>
      <HorizontalStack gap='6' align='space-between'>
        <HorizontalStack gap='6' blockAlign='center'>
          <Button size='micro' onClick={() => navigate("/")}>
            <Icon source={ArrowLeftMinor} color='base' />
          </Button>
          <Text variant='headingXl' as='h4'>
            {editBundleRule ? "Edit Bundle Rule" : "Create Bundle Rule"}
          </Text>
        </HorizontalStack>
        {/* <Box>
          <Button primary onClick={handleGenerateBundle}>
            Generate
          </Button>
        </Box> */}
      </HorizontalStack>
      <Box paddingBlockStart='6'>
        <LegacyCard>
          <LegacyCard.Section>
            <TextField
              label='Bundle Rule Name'
              value={bundleRuleName}
              onChange={handleBundleRuleNameChange}
              autoComplete='off'
            />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <BundleRuleTags
              bundleRuleProductTags={bundleRuleProductTags}
              setBundleRuleProductTags={setBundleRuleProductTags}
              selectedProductTags={selectedProductTags}
              setSelectedProductTags={setSelectedProductTags}
            />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <BundleFormDiscount
              selectedDiscountType={selectedDiscountType}
              setSelectedDiscountType={setSelectedDiscountType}
              selectedDiscountValue={selectedDiscountValue}
              setSelectedDiscountValue={setSelectedDiscountValue}
            />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <TextField
              label='Total Products'
              type='number'
              value={bundleRuleTotalProducts}
              onChange={handleBundleRuleTotalProductsChange}
              autoComplete='off'
            />
          </LegacyCard.Section>
          <LegacyCard.Section>
            <HorizontalStack gap='6'>
              <TextField
                label='Minimum Price'
                type='number'
                value={bundleRuleMinimumPrice}
                onChange={handleBundleRuleMinimumPriceChange}
                autoComplete='off'
              />
              <TextField
                label='Maximum Price'
                type='number'
                value={bundleRuleMaximumPrice}
                onChange={handleBundleRuleMaximumPriceChange}
                autoComplete='off'
              />
            </HorizontalStack>
          </LegacyCard.Section>
        </LegacyCard>
      </Box>
      {toastMarkup}
    </Box>
  );
}
