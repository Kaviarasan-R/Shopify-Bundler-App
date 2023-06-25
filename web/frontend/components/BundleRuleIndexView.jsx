import { LegacyCard, HorizontalStack, Spinner } from "@shopify/polaris";
import { BundleRuleViewFilters } from "./BundleRuleViewFilters";
import "../assets/styles.css";
import { useAuthenticatedFetch } from "../hooks";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import BundleRuleIndexData from "./BundleRuleIndexData";
import { BundleViewPagination } from "./BundleViewPagination";

export function BundleRuleIndexView(props) {
  const fetch = useAuthenticatedFetch();
  /* STATES */

  // FILTERS & QUERIES
  const [sort, setSort] = useState("ASC");
  const [searchQueryValue, setSearchQueryValue] = useState("");
  const [debouncedQueryBundle] = useDebounce(searchQueryValue, 1000);

  // PAGINATION
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBundleRuleItems, setTotalBundleRuleItems] = useState(1);
  const [visitedPages, setVisitedPages] = useState(new Set([0]));
  const totalPages = Math.ceil(totalBundleRuleItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // BUNDLE RULES
  const [bundleRules, setBundleRules] = useState([]);
  const [isFetchingBundleRules, setIsFetchingBundleRules] = useState(false);

  /* FETCH BUNDLE RULES */

  useEffect(() => {
    let isMounted = true;

    const onFetchBundleRules = async () => {
      setIsFetchingBundleRules(true);

      const fetchUrl = `/api/bundles/rules/fetch?page=${currentPage}&sort=${sort}&queryBundle=${debouncedQueryBundle}`;

      try {
        const response = await fetch(fetchUrl);
        if (!isMounted) return; // Ignore the response if the component is unmounted

        const res = await response.json();
        const updatedBundleRules = res.bundleRules.map((bundleRule) => ({
          ...bundleRule,
          tags: bundleRule.tags.split(","),
        }));

        setBundleRules((prev) => [...prev, ...updatedBundleRules]);
        setTotalBundleRuleItems(res.totalBundleRules);
        setIsFetchingBundleRules(false);
      } catch (err) {
        console.log(err);
      }
    };

    if (!visitedPages.has(currentPage)) {
      onFetchBundleRules();
      setVisitedPages((prev) => {
        const newVisitedPages = new Set(prev);
        newVisitedPages.add(currentPage);
        return newVisitedPages;
      });
    }

    return () => {
      isMounted = false;
    };
  }, [currentPage, sort, debouncedQueryBundle]);

  useEffect(() => {
    reset();
  }, [debouncedQueryBundle]);

  /* FUNCTIONS */
  const reset = () => {
    setCurrentPage(1);
    setVisitedPages(new Set([0]));
    setBundleRules([]);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <LegacyCard>
        <LegacyCard.Section>
          <div className='filter--container'>
            <BundleRuleViewFilters
              sort={sort}
              setSort={setSort}
              searchQueryValue={searchQueryValue}
              setSearchQueryValue={setSearchQueryValue}
              reset={reset}
            />
          </div>
        </LegacyCard.Section>
        <LegacyCard.Section>
          {isFetchingBundleRules ? (
            <HorizontalStack align='center' blockAlign='center'>
              <Spinner accessibilityLabel='Spinner example' size='large' />
            </HorizontalStack>
          ) : (
            <BundleRuleIndexData
              bundleRules={bundleRules}
              startIndex={startIndex}
              endIndex={endIndex}
              totalBundleRuleItems={totalBundleRuleItems}
            />
          )}
        </LegacyCard.Section>
        <LegacyCard.Section>
          <HorizontalStack align='center'>
            <BundleViewPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </HorizontalStack>
        </LegacyCard.Section>
      </LegacyCard>
    </div>
  );
}

export default BundleRuleIndexView;
