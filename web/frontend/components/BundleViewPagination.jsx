import { Pagination } from "@shopify/polaris";
import { useCallback } from "react";

export function BundleViewPagination(props) {
  const { currentPage, setCurrentPage, totalPages } = props;
  const handlePageChange = useCallback((selectedPage) => {
    setCurrentPage(selectedPage);
  }, []);
  return (
    <Pagination
      label={`Showing page ${currentPage}`}
      hasPrevious={currentPage > 1}
      onPrevious={() => handlePageChange(currentPage - 1)}
      hasNext={currentPage < totalPages}
      onNext={() => handlePageChange(currentPage + 1)}
    />
  );
}
