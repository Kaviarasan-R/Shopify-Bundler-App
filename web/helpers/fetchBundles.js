import fetchAllBundleProducts from "../controllers/fetchAllBundleProducts.js";

export default async function fetchBundles(
  pageNumber,
  bundleStatus,
  sortPage,
  bundleType,
  queryBundle
) {
  try {
    const response = await fetchAllBundleProducts(
      pageNumber,
      bundleStatus,
      sortPage,
      bundleType,
      queryBundle
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}
