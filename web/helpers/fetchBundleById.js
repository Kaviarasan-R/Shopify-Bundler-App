import fetchBundleById from "../controllers/fetchBundleById.js";

export default async function fetchBundlesById(bundleId) {
  try {
    const fetchBundlesById = await fetchBundleById(bundleId);
    return fetchBundlesById;
  } catch (err) {
    console.log(err);
  }
}
