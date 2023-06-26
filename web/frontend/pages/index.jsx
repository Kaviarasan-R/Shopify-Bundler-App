import {
  LegacyCard,
  Text,
  Box,
  HorizontalStack,
  Spinner,
  Button,
} from "@shopify/polaris";
import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

/* Components */
import {
  MainTab,
  CreateBundleModal,
  BundleViewStatus,
  tabs,
  BundleViewPagination,
  BundleViewFilters,
  BundleViewIndexData,
  BundleRuleIndexView,
} from "../components";

import "../assets/styles.css";

export default function Index() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  /* STATES */

  // TABS
  const [selectedTab, setSelectedTab] = useState(0);

  // PAGINATION
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBundleItems, setTotalBundleItems] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([0]));
  const totalPages = Math.ceil(totalBundleItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // SEARCH, FILTERS & SORT
  const [bundleIndex, setBundleIndex] = useState(0);
  const [searchQueryValue, setSearchQueryValue] = useState("");
  const [bundleType, setBundleType] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [debouncedQueryBundle] = useDebounce(searchQueryValue, 1000);

  // PRODUCT POPOVER ITEMS
  const [popoverActive, setPopoverActive] = useState(
    Array(totalBundleItems).fill(false)
  );

  // BUNDLE
  const [bundles, setBundles] = useState([]);
  const [isFetchingBundles, setIsFetchingBundles] = useState(false);

  /* BUNDLE API REQUEST */
  const onFetchBundles = async () => {
    setIsFetchingBundles(true);

    const fetchUrl = `/api/bundles?page=${currentPage}&status=${
      tabs[selectedTab].panelID
    }&sort=${sort}&bundleType=${
      bundleType.length > 0 ? bundleType.join(",") : "NA"
    }&queryBundle=${debouncedQueryBundle}`;

    await fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        setBundles((prev) => [...prev, ...res.response.bundles]);
        setTotalBundleItems(res.response.totalBundles);
        setIsFetchingBundles(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!visitedPages.has(currentPage)) {
        await onFetchBundles();
        setVisitedPages((prev) => {
          const newVisitedPages = new Set(prev);
          newVisitedPages.add(currentPage);
          return newVisitedPages;
        });
      }
    };

    // Fetch data when debouncedQueryBundle changes or any of the other dependencies change
    if (
      debouncedQueryBundle.trim() !== "" ||
      currentPage !== 1 ||
      selectedTab !== "" ||
      sort !== "" ||
      bundleType !== ""
    ) {
      fetchData();
    }
  }, [
    debouncedQueryBundle,
    currentPage,
    selectedTab,
    sort,
    bundleType,
    visitedPages,
  ]);

  useEffect(() => {
    reset();
  }, [debouncedQueryBundle])

  const reset = () => {
    setCurrentPage(1);
    setVisitedPages(new Set([0]));
    setBundles([]);
  };

  return (
    <>
      <MainTab />
      <Box padding='6'>
        <HorizontalStack align='space-between'>
          <Text variant='headingXl' as='h4'>
            Home
          </Text>
          <CreateBundleModal />
        </HorizontalStack>
        <Box paddingBlockStart='6'>
          <LegacyCard>
            <BundleViewStatus
              selected={selectedTab}
              setSelectedTab={setSelectedTab}
              reset={reset}
            />
            <LegacyCard.Section>
              <Box paddingBlockEnd='6'>
                <div className='filter--container'>
                  <BundleViewFilters
                    bundleType={bundleType}
                    setBundleType={setBundleType}
                    sort={sort}
                    setSort={setSort}
                    searchQueryValue={searchQueryValue}
                    setSearchQueryValue={setSearchQueryValue}
                    reset={reset}
                  />
                </div>
              </Box>
              {isFetchingBundles && (
                <HorizontalStack align='center' blockAlign='center'>
                  <Spinner accessibilityLabel='Spinner example' size='large' />
                </HorizontalStack>
              )}
              {!isFetchingBundles && (
                <BundleViewIndexData
                  bundles={bundles}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalBundleItems={totalBundleItems}
                  popoverActive={popoverActive}
                  setPopoverActive={setPopoverActive}
                  bundleIndex={bundleIndex}
                  setBundleIndex={setBundleIndex}
                />
              )}
              <HorizontalStack align='center'>
                <BundleViewPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </HorizontalStack>
            </LegacyCard.Section>
          </LegacyCard>
        </Box>

        <Box paddingBlockStart='6'>
          <HorizontalStack align='end'>
            <Button primary onClick={() => navigate("/createbundlerule")}>
              Create Bundle Rule
            </Button>
          </HorizontalStack>
          <BundleRuleIndexView />
        </Box>
      </Box>
    </>
  );
}
