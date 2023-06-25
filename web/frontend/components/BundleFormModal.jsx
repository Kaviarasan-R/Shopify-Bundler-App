import {
  Modal,
  LegacyCard,
  TextField,
  HorizontalStack,
  Spinner,
  ChoiceList,
  Pagination,
  Button,
  Icon,
} from "@shopify/polaris";

import { useCallback } from "react";

import { SearchMajor } from "@shopify/polaris-icons";

import "../assets/styles.css";

export function BundleFormModal(props) {
  const {
    browseActive,
    setBrowseActive,
    queryProducts,
    setQueryProducts,
    selectedBundleProducts,
    setSelectedBundleProducts,
    prevSelectedBundleProducts,
    setPrevSelectedBundleProducts,
    renderSelectedItems,
    setRenderSelectedItems,
    currentPage,
    setCurrentPage,
    setIsModalClosed,
    listOfProducts,
    startIndex,
    endIndex,
    totalPages,
    hasNextPage,
    isProductFetching,
  } = props;

  const handleBrowseChange = useCallback(() => {
    if (browseActive) {
      setSelectedBundleProducts(prevSelectedBundleProducts);
      setIsModalClosed(false);
    } else {
      setPrevSelectedBundleProducts(selectedBundleProducts);
    }
    setBrowseActive(!browseActive);
  }, [browseActive, prevSelectedBundleProducts, selectedBundleProducts]);

  const handleDoneChange = useCallback(() => {
    const items = selectedBundleProducts?.map((data) => ({
      id: data.split(",")[0],
      title: data.split(",")[1],
      url: data.split(",")[2],
      price: data.split(",")[3],
    }));
    setRenderSelectedItems(items);
    setIsModalClosed(false);
    setBrowseActive(!browseActive);
  }, [browseActive, selectedBundleProducts, renderSelectedItems]);

  const productsModalChoiceList = listOfProducts
    .slice(startIndex, endIndex)
    ?.map((data) => ({
      label: (
        <div className='modal--product--container'>
          <img
            src={data?.image}
            className='modal--products--image'
            width={50}
            height={50}
          />
          <p>
            {data?.title.length > 42
              ? `${data?.title.slice(0, 42)}...`
              : data?.title}
          </p>
          <p style={{ fontWeight: "bold" }}>₹ {data?.price}</p>
        </div>
      ),
      value:
        data?.id + "," + data?.title + "," + data?.image + "," + data?.price,
    }));

  const browseActivator = (
    <Button onClick={handleBrowseChange} primary>
      Browse
    </Button>
  );

  /* HANDLE CHANGES */

  const handleQueryProductsChange = useCallback((value) => {
    setQueryProducts(value);
  });

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handleProductSelectedChange = useCallback(
    (value) => {
      setSelectedBundleProducts(value);
    },
    [selectedBundleProducts]
  );

  return (
    <Modal
      activator={browseActivator}
      open={browseActive}
      onClose={handleBrowseChange}
      title='Add products'
      primaryAction={{
        content: "Done",
        onAction: handleDoneChange,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleBrowseChange,
        },
      ]}
    >
      <Modal.Section>
        <LegacyCard.Section>
          <TextField
            prefix={<Icon source={SearchMajor} />}
            placeholder='Search products'
            value={queryProducts}
            onChange={handleQueryProductsChange}
            autoComplete='off'
          />
        </LegacyCard.Section>
        <LegacyCard.Section>
          {isProductFetching && (
            <HorizontalStack blockAlign='center' align='center'>
              <Spinner accessibilityLabel='Spinner example' size='large' />
            </HorizontalStack>
          )}
          {!isProductFetching && (
            <ChoiceList
              allowMultiple
              choices={productsModalChoiceList}
              selected={selectedBundleProducts}
              onChange={handleProductSelectedChange}
            />
          )}
        </LegacyCard.Section>
        <LegacyCard.Section>
          <HorizontalStack blockAlign='center' align='center'>
            {!isProductFetching && (
              <Pagination
                label={`Showing page ${currentPage}`}
                hasPrevious={currentPage > 1}
                onPrevious={() => handlePageChange(currentPage - 1)}
                hasNext={currentPage < totalPages || hasNextPage}
                onNext={() => handlePageChange(currentPage + 1)}
              />
            )}
          </HorizontalStack>
        </LegacyCard.Section>
      </Modal.Section>
    </Modal>
  );
}

export default BundleFormModal;
