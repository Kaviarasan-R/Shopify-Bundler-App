import BundleRule from "../models/bundleRule.js";

const fetchBundleRuleById = async (id) => {
  try {
    const bundleRule = await BundleRule.findOne({
      where: {
        id: id,
      },
    });

    return { bundleRule };
  } catch (error) {
    throw error;
  }
};

export default fetchBundleRuleById;
