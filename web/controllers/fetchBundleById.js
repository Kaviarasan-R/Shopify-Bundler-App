import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Bundle from "../models/bundle.js";
import Product from "../models/product.js";
import BundleProduct from "../models/bundleProduct.js";

const fetchBundleById = async (bundleProductId) => {
  try {
    const bundle = await Bundle.findOne({
      where: {
        product_id: bundleProductId,
      },
    });

    const bundleId = bundle.id;

    const bundleProducts = await BundleProduct.findAll({
      where: {
        bundleId: bundleId,
      },
    });

    const productIds = bundleProducts.map((data) => data.productId);

    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds,
        },
      },
    });

    return { bundle, products };
  } catch (error) {
    throw error;
  }
};

export default fetchBundleById;
