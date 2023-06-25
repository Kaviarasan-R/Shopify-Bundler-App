import BundleRule from "../models/bundleRule.js";

const deleteSelectedBundleRules = async (body) => {
  try {
    const id = body;

    // Delete the bundles
    const deletedBundleRuleIds = await BundleRule.destroy({
      where: {
        id: id,
      },
    });

    return deletedBundleRuleIds;
  } catch (error) {
    throw error;
  }
};

export default deleteSelectedBundleRules;
