import { ChoiceList, TextField, Filters, Icon } from "@shopify/polaris";
import { SearchMajor } from "@shopify/polaris-icons";
import { useCallback } from "react";

export function BundleRuleViewFilters(props) {
  const { sort, setSort, searchQueryValue, setSearchQueryValue, reset } = props;

  const handleSortChange = useCallback((value) => {
    setSort(value);
    reset();
  }, []);

  const handleSearchQueryChange = useCallback(
    (value) => setSearchQueryValue(value),
    []
  );

  const filters = [
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

  return (
    <>
      <TextField
        value={searchQueryValue}
        onChange={handleSearchQueryChange}
        placeholder='Filter bundles rules by name'
        prefix={<Icon source={SearchMajor} color='base' />}
        autoComplete='off'
      />
      <Filters hideQueryField={true} filters={filters} />
    </>
  );
}
