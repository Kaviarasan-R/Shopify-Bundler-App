import {
  Frame,
  ContextualSaveBar,
  Box,
  Text,
  Icon,
  Button,
  HorizontalStack,
  Grid,
  LegacyCard,
  ChoiceList,
} from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { useAuthenticatedFetch, useBundleFormSubmission } from "../hooks";
import {
  SelectedBundleProductList,
  BundleFormDiscount,
  BundleFormGeneral,
  BundleFormStatus,
  BundleFormPreview,
  BundleFormModal,
  BundleFormUseEffectDefineURL,
  BundleFormUseEffectFetchProducts,
  BundleFormUseEffectRenderItems,
} from "../components";
import { useNavigate, Toast } from "@shopify/app-bridge-react";
import { useDebounce } from "use-debounce";
import "../assets/styles.css";

export default function CreateBundleForm() {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const onSave = useBundleFormSubmission();

  /* STATES */

  // DISCOUNTS
  const [selectedDiscountType, setSelectedDiscountType] = useState([
    "percentageDiscount",
  ]);
  const [selectedDiscountValue, setSelectedDiscountValue] = useState(0);

  // GENERAL
  const [bundleName, setBundleName] = useState("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");

  // BUNDLE AS PRODUCT
  const [selectedBundleAsProduct, setSelectedBundleAsProduct] =
    useState("true");

  // STATUS
  const [popoverBundleStatusActive, setPopoverBundleStatusActive] =
    useState(false);
  const [selectedBundleStatus, setSelectedBundleStatus] = useState("Active");

  // TOAST
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // BUNDLE PREVIEW
  const [totalBundlePrice, setTotalBundlePrice] = useState(0);
  const [totalSavedBundlePrice, setTotalSavedBundlePrice] = useState(0);
  const [renderTotalBundlePrice, setRenderTotalBundlePrice] = useState(0); // Price after discount

  // BUNDLE PRODUCTS
  const [browseActive, setBrowseActive] = useState(false);
  const [queryProducts, setQueryProducts] = useState("");
  const [debouncedQueryProduct] = useDebounce(queryProducts, 1000);
  const [selectedBundleProducts, setSelectedBundleProducts] = useState([]);
  const [prevSelectedBundleProducts, setPrevSelectedBundleProducts] = useState(
    []
  );
  const [renderSelectedItems, setRenderSelectedItems] = useState([]);
  const [isModalClosed, setIsModalClosed] = useState(false);

  // FETCH PRODUCTS LIST
  const [listOfProducts, setListOfProducts] = useState([]);
  const [isProductFetching, setIsProductFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [cursor, setCursor] = useState("");
  const [currentAPIRequestType, setCurrentAPIRequestType] = useState("list");

  // FETCH PRODUCTS LIST PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([0]));
  const itemsPerPage = 5;
  const totalItems = listOfProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // EDIT BUNDLE
  const [editBundle, setEditBundle] = useState(false);
  const [editBundleId, setEditBundleId] = useState("");
  const [performance, setPerformance] = useState(0);
  const [bundleId, setBundleId] = useState(0);

  /* HANDLE CHANGES */

  // BUNDLE AS PRODUCT
  const handleBundleAsProduct = useCallback(
    (value) => setSelectedBundleAsProduct(value),
    []
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

  // REMOVE PRODUCT
  const handleProductRemoveItem = useCallback(
    (id) => {
      setSelectedBundleProducts((prev) =>
        prev.filter((data, index) => data.split(",")[0] !== id)
      );
    },
    [selectedBundleProducts]
  );

  /* EDIT BUNDLE */

  useEffect(() => {
    const field = "productId";
    const queryUrl = window.location.href;
    if (queryUrl.indexOf("?" + field + "=") != -1) {
      setEditBundle(true);
      setEditBundleId(queryUrl.split("productId=").slice(-1));
    } else {
      setEditBundle(false);
      setEditBundleId("");
    }
  }, []);

  useEffect(async () => {
    if (editBundle) {
      await fetch(`/api/bundles/${editBundleId}`)
        .then((res) => res.json())
        .then((res) => {
          // SET GENERAL
          setBundleName(res.bundle.name);
          setBundleTitle(res.bundle.title);
          setBundleDescription(res.bundle.description);
          // SET STATUS
          setSelectedBundleStatus(
            res.bundle.status === "ACTIVE" ? "Active" : "Draft"
          );
          // SET PRODUCTS
          const selectedProductItems = res.products.map(
            (object) =>
              `${object.product_id},${object.title},${object.image},${object.price}.0`
          );
          setSelectedBundleProducts(selectedProductItems);
          setPrevSelectedBundleProducts(selectedProductItems);
          // SET DISCOUNT
          setSelectedDiscountType([res.bundle.discount_type]);
          setSelectedDiscountValue(Number(res.bundle.discount_value));
          // SET PREVIEW
          setTotalBundlePrice(res.bundle.total_product_price);
          setRenderTotalBundlePrice(res.bundle.price_after_discount);
          setTotalSavedBundlePrice(res.bundle.total_saved_price);
          // SET PERFORMANCE
          setPerformance(res.bundle.performance);
          // SET BUNDLE ID
          setBundleId(res.bundle.id);
        });
    }
    return () => {};
  }, [editBundle]);

  /* RESET STATES FOR QUERY CHANGE */

  const reset = () => {
    setHasNextPage(false);
    setCursor("");
    setListOfProducts([]);
    setCurrentPage(1);
    setVisitedPages(new Set([0]));
  };

  /* FORM SUBMISSION */

  const onSaveBundle = () => {
    const props = {
      bundleId,
      bundleName,
      bundleTitle,
      bundleDescription,
      selectedBundleStatus,
      renderSelectedItems,
      selectedDiscountType: selectedDiscountType[0],
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
              onAction: onSaveBundle,
            }}
            discardAction={{
              onAction: () => navigate("/"),
            }}
          />
        </Frame>
      </div>
      <HorizontalStack gap='6'>
        <Button size='micro' onClick={() => navigate("/")}>
          <Icon source={ArrowLeftMinor} color='base' />
        </Button>
        <Text variant='headingXl' as='h4'>
          {editBundle ? "Edit Bundle" : "Create Bundle"}
        </Text>
      </HorizontalStack>
      <Box paddingBlockStart='6'>
        <Grid
          columns={{ xs: 1, sm: 4, md: 6, lg: 6, xl: 6 }}
          areas={{
            xs: ["bundleConfig", "bundleStatus"],
            sm: [
              "bundleConfig bundleConfig bundleConfig bundleConfig",
              "bundleStatus bundleStatus bundleStatus bundleStatus",
            ],
            md: [
              "bundleConfig bundleConfig bundleConfig bundleConfig bundleStatus bundleStatus",
            ],
            lg: [
              "bundleConfig bundleConfig bundleConfig bundleConfig bundleStatus bundleStatus",
            ],
            xl: [
              "bundleConfig bundleConfig bundleConfig bundleConfig bundleStatus bundleStatus",
            ],
          }}
        >
          <Grid.Cell area='bundleConfig'>
            <LegacyCard title='Bundled Products' sectioned>
              <HorizontalStack
                align='space-between'
                blockAlign='center'
                gap='3'
              >
                <p className='bundle--form--description'>
                  Add products you want to sell together.
                </p>
                <BundleFormModal
                  browseActive={browseActive}
                  setBrowseActive={setBrowseActive}
                  queryProducts={queryProducts}
                  setQueryProducts={setQueryProducts}
                  selectedBundleProducts={selectedBundleProducts}
                  setSelectedBundleProducts={setSelectedBundleProducts}
                  prevSelectedBundleProducts={prevSelectedBundleProducts}
                  setPrevSelectedBundleProducts={setPrevSelectedBundleProducts}
                  renderSelectedItems={renderSelectedItems}
                  setRenderSelectedItems={setRenderSelectedItems}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setIsModalClosed={setIsModalClosed}
                  listOfProducts={listOfProducts}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  isProductFetching={isProductFetching}
                />
              </HorizontalStack>
              {!browseActive && (
                <SelectedBundleProductList
                  items={renderSelectedItems}
                  setItems={setRenderSelectedItems}
                  setSelectedBundleProducts={handleProductRemoveItem}
                />
              )}
            </LegacyCard>
            <LegacyCard title='Discount' sectioned>
              <BundleFormDiscount
                selectedDiscountType={selectedDiscountType}
                setSelectedDiscountType={setSelectedDiscountType}
                selectedDiscountValue={selectedDiscountValue}
                setSelectedDiscountValue={setSelectedDiscountValue}
              />
            </LegacyCard>
            <LegacyCard title='General' sectioned>
              <BundleFormGeneral
                bundleName={bundleName}
                setBundleName={setBundleName}
                bundleTitle={bundleTitle}
                setBundleTitle={setBundleTitle}
                bundleDescription={bundleDescription}
                setBundleDescription={setBundleDescription}
              />
            </LegacyCard>
            <LegacyCard title='Bundle as a product' sectioned>
              <ChoiceList
                title='Bundle As Product'
                titleHidden
                choices={[
                  { label: "Make a product from this bundle", value: "true" },
                ]}
                disabled
                allowMultiple
                selected={selectedBundleAsProduct}
                onChange={handleBundleAsProduct}
              />
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell area='bundleStatus'>
            <LegacyCard title='Bundle status' sectioned>
              <BundleFormStatus
                popoverBundleStatusActive={popoverBundleStatusActive}
                setPopoverBundleStatusActive={setPopoverBundleStatusActive}
                selectedBundleStatus={selectedBundleStatus}
                setSelectedBundleStatus={setSelectedBundleStatus}
              />
            </LegacyCard>
            <LegacyCard title='Bundle preview' sectioned>
              <BundleFormPreview
                totalBundlePrice={totalBundlePrice}
                setTotalBundlePrice={setTotalBundlePrice}
                totalSavedBundlePrice={totalSavedBundlePrice}
                setTotalSavedBundlePrice={setTotalSavedBundlePrice}
                renderTotalBundlePrice={renderTotalBundlePrice}
                setRenderTotalBundlePrice={setRenderTotalBundlePrice}
                renderSelectedItems={renderSelectedItems}
                selectedDiscountType={selectedDiscountType}
                selectedDiscountValue={selectedDiscountValue}
                browseActive={browseActive}
                bundleTitle={bundleTitle}
              />
            </LegacyCard>
          </Grid.Cell>
        </Grid>
        <Box paddingBlockStart='6'>
          <HorizontalStack gap='5'>
            <Button primary onClick={onSaveBundle}>
              Save
            </Button>
          </HorizontalStack>
        </Box>
      </Box>
      {toastMarkup}
      <BundleFormUseEffectDefineURL
        debouncedQueryProduct={debouncedQueryProduct}
        currentAPIRequestType={currentAPIRequestType}
        hasNextPage={hasNextPage}
        cursor={cursor}
        setCurrentAPIRequestType={setCurrentAPIRequestType}
        reset={reset}
      />
      <BundleFormUseEffectFetchProducts
        debouncedQueryProduct={debouncedQueryProduct}
        currentPage={currentPage}
        cursor={cursor}
        setCursor={setCursor}
        hasNextPage={hasNextPage}
        setHasNextPage={setHasNextPage}
        visitedPages={visitedPages}
        setVisitedPages={setVisitedPages}
        setListOfProducts={setListOfProducts}
        setIsProductFetching={setIsProductFetching}
        currentAPIRequestType={currentAPIRequestType}
      />
      <BundleFormUseEffectRenderItems
        isModalClosed={isModalClosed}
        selectedBundleProducts={selectedBundleProducts}
        setRenderSelectedItems={setRenderSelectedItems}
      />
    </Box>
  );
}
