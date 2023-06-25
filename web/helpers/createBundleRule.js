import BundleRuleCreate from "../controllers/bundleRuleCreate.js";

export default async function createBundleRule(body) {
  let message = "Bundle rule is already exists";
  let status = false;
  let error = "";
  const result = await BundleRuleCreate(body)
    .then((res) => {
      message = res.message;
      status = res.status;
    })
    .catch((err) => {
      message = err.name;
      error = err;
      status = false;
    });

  return { message, status, error };
}
