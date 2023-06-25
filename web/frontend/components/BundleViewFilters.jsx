import { ChoiceList, TextField, Filters, Icon } from "@shopify/polaris";
import { SearchMajor } from "@shopify/polaris-icons";
import { useCallback } from "react";

function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}

export function BundleViewFilters(props) {
  const {
    bundleType,
    setBundleType,
    sort,
    setSort,
    searchQueryValue,
    setSearchQueryValue,
    reset,
  } = props;

  const handleSortChange = useCallback((value) => {
    setSort(value);
    reset();
  }, []);

  const handleBundleTypeChange = useCallback((value) => {
    setBundleType(value);
    reset();
  }, []);

  const handleBundleTypeRemove = useCallback((value) => {
    setBundleType((prev) => prev.filter((val) => val !== value));
    reset();
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    handleBundleTypeRemove();
    reset();
  }, [handleBundleTypeRemove]);

  const handleSearchQueryChange = useCallback(
    (value) => setSearchQueryValue(value),
    []
  );

  const filters = [
    {
      key: "bundleType",
      label: "Bundle Type",
      filter: (
        <ChoiceList
          title='Bundle Type'
          titleHidden
          choices={[
            { label: "Bundle", value: "bundle" },
            { label: "Volume Discount", value: "volume_discount" },
            { label: "Product Mix & Match", value: "product_mix_and_match" },
            {
              label: "Collection Mix & Match",
              value: "collection_mix_and_match",
            },
            { label: "Buy X Get Y", value: "buy_x_get_y" },
          ]}
          selected={bundleType || []}
          onChange={handleBundleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "sort",
      label: "Sort",
      filter: (
        <ChoiceList
          title='Sort'
          titleHidden
          choices={[
            { label: "Created (Oldest First)", value: "ASC" },
            { label: "Created (Newest First)", value: "DESC" },
          ]}
          selected={sort}
          onChange={handleSortChange}
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(bundleType)) {
    const key = "bundleType";
    bundleType.forEach((value) => {
      appliedFilters.push({
        key,
        label: `Type: ${value}`,
        onRemove: () => handleBundleTypeRemove(value),
      });
    });
  }

  return (
    <>
      <TextField
        value={searchQueryValue}
        onChange={handleSearchQueryChange}
        placeholder='Filter bundles by included products'
        prefix={<Icon source={SearchMajor} color='base' />}
        autoComplete='off'
      />
      <Filters
        hideQueryField={true}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
      />
    </>
  );
}
