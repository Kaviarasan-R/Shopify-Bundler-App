import deleteSelectedBundleRules from "../controllers/deleteSelectedBundleRules.js";

export default async function deleteBundleRules(body) {
  let success = false;
  let error = "";
  try {
    for (const id of body) {
      const response = await deleteSelectedBundleRules(id);

      if (response) (success = true), (error = "");
      else success = false;
    }
    return { success: success, error: error };
  } catch (err) {
    console.log(err);
  }
}
