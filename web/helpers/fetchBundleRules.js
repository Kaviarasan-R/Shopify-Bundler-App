import fetchAllBundleRules from "../controllers/fetchAllBundleRules.js";

export default async function fetchBundleRules(
  pageNumber,
  sortPage,
  queryBundle
) {
  try {
    const response = await fetchAllBundleRules(
      pageNumber,
      sortPage,
      queryBundle
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}
