import { useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

export function BundleFormUseEffectDefineURL(props) {
  const {
    debouncedQueryProduct,
    currentAPIRequestType,
    setCurrentAPIRequestType,
    reset,
  } = props;
  useEffect(() => {
    if (debouncedQueryProduct) {
      if (currentAPIRequestType === "list") {
        reset();
        setCurrentAPIRequestType("search");
      }
    } else {
      if (currentAPIRequestType === "search") {
        reset();
        setCurrentAPIRequestType("list");
      }
    }
  }, [debouncedQueryProduct]);
  return null;
}

export function BundleFormUseEffectFetchProducts(props) {
  const {
    debouncedQueryProduct,
    currentPage,
    cursor,
    setCursor,
    hasNextPage,
    setHasNextPage,
    visitedPages,
    setVisitedPages,
    setListOfProducts,
    setIsProductFetching,
    currentAPIRequestType,
  } = props;
  const fetch = useAuthenticatedFetch();

  const onFetchProducts = async () => {
    setIsProductFetching(true);

    const url =
      currentAPIRequestType === "search"
        ? hasNextPage
          ? `/api/products?title=${debouncedQueryProduct}&cursor=${cursor}`
          : `/api/products?title=${debouncedQueryProduct}`
        : hasNextPage
        ? `/api/products?cursor=${cursor}`
        : `/api/products`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.products?.data) {
          setListOfProducts((prev) => [...prev, data?.products?.data].flat());
        }
        setHasNextPage(data?.products?.page?.hasNextPage);
        setCursor(data?.products?.page?.endCursor);
      })
      .catch((err) => {
        console.error("error while fetching /api/products", err);
      });
    setIsProductFetching(false);
  };

  useEffect(() => {
    if (!visitedPages.has(currentPage)) {
      onFetchProducts();
      setVisitedPages((prev) => new Set([...prev, currentPage]));
    }
    return () => {};
  }, [currentPage, visitedPages]);

  return null;
}

export function BundleFormUseEffectRenderItems(props) {
  const { isModalClosed, selectedBundleProducts, setRenderSelectedItems } =
    props;
  useEffect(() => {
    if (!isModalClosed) {
      const items = selectedBundleProducts?.map((data) => ({
        id: data.split(",")[0],
        title: data.split(",")[1],
        url: data.split(",")[2],
        price: data.split(",")[3],
      }));
      setRenderSelectedItems(items);
    }
  }, [selectedBundleProducts, isModalClosed]);
  return null;
}
