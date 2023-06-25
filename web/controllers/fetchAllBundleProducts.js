import sequelize from "../config/database.js";
import Bundle from "../models/bundle.js";
import Product from "../models/product.js";
import BundleProduct from "../models/bundleProduct.js";
import { Op } from "sequelize";

Bundle.belongsToMany(Product, { through: "bundle_products" });
Product.belongsToMany(Bundle, { through: "bundle_products" });
Bundle.hasMany(BundleProduct);
Product.hasMany(BundleProduct);

const fetchAllBundleProducts = async (
  pageNumber,
  bundleStatus,
  sortPage,
  bundleType,
  queryBundle
) => {
  try {
    const itemsPerPage = 5;
    const offset = (pageNumber - 1) * itemsPerPage;
    const whereClause = bundleStatus !== "ALL" ? { status: bundleStatus } : {};
    const sortBy = sortPage;
    const bundleTypes = bundleType === "NA" ? [] : bundleType.split(",");
    const whereConditions = { ...whereClause };
    if (bundleTypes.length > 0) {
      whereConditions.product_type = { [Op.in]: bundleTypes };
    }
    if (queryBundle && queryBundle.trim() !== "") {
      const products = await Product.findAll({
        where: {
          title: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("title")),
            "LIKE",
            "%" + queryBundle.trim() + "%"
          ),
        },
      });

      const productIds = products.map((product) => product.id);

      const bundleProducts = await BundleProduct.findAll({
        where: {
          productId: {
            [Op.in]: productIds,
          },
        },
        attributes: ["bundleId"],
      });

      const bundleIds = bundleProducts.map(
        (bundleProduct) => bundleProduct.bundleId
      );

      whereConditions.id = {
        [Op.in]: bundleIds,
      };
      console.log("INSIDE");
    }
    const bundles = await Bundle.findAll({
      include: [{ model: Product }],
      where: whereConditions,
      offset,
      limit: itemsPerPage,
      order: [["updatedAt", sortBy]],
    });
    const totalBundles = await Bundle.count({
      where: whereConditions,
    });
    return { bundles, totalBundles };
  } catch (err) {
    throw err;
  }
};

export default fetchAllBundleProducts;
