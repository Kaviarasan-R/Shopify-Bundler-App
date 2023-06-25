import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Bundle from "../models/bundle.js";
import BundleProduct from "../models/bundleProduct.js";
import Product from "../models/product.js";

const deleteSelectedBundles = async (body) => {
  try {
    const productId = body.trim(); // Trim any leading or trailing spaces

    // Find and delete the bundles
    const deletedBundles = await Bundle.findAll({
      where: {
        product_id: productId,
      },
    });

    // Get the IDs of the deleted bundles
    const deletedBundleIds = deletedBundles.map((bundle) => bundle.id);

    // Delete the bundleProducts based on the deleted bundle IDs
    await BundleProduct.destroy({
      where: {
        bundleId: {
          [Op.in]: deletedBundleIds,
        },
      },
    });

    // Delete the bundles
    await Bundle.destroy({
      where: {
        product_id: productId,
      },
    });

    return deletedBundleIds;
  } catch (error) {
    throw error;
  }
};

export default deleteSelectedBundles;
