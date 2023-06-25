import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Bundle from "../models/bundle.js";
import Product from "../models/product.js";
import BundleProduct from "../models/bundleProduct.js";

Bundle.belongsToMany(Product, { through: "bundle_products" });
Product.belongsToMany(Bundle, { through: "bundle_products" });

const BundleProductCreate = async (req, res) => {
  const product_data = req.body.selectedProducts.map((data) => ({
    product_id: data.id,
    title: data.title,
    image: data.url,
    price: Number(data.price),
  }));

  const bundle_data = {
    product_id: req.response.productId,
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    discount_type: req.body.discountType,
    discount_value: Number(req.body.discountValue),
    price_after_discount: Number(req.body.price), // price
    total_product_price: Number(req.body.totalBundlePrice), // totalBundlePrice
    total_saved_price: Number(req.body.savedBundlePrice), // savedBundlePrice
    product_type: "bundle",
    performance: req.body.performance,
  };

  return new Promise((resolve, reject) => {
    sequelize.transaction(async (transaction) => {
      try {
        const createdBundle = await Bundle.create(bundle_data, {
          validate: true,
          transaction,
        });

        const existingProducts = await Product.findAll({
          where: {
            product_id: product_data.map((product) => product.product_id),
          },
          attributes: ["id", "product_id"],
          raw: true,
          transaction,
        });

        const existingProductIds = existingProducts.map(
          (product) => product.id
        );

        const newProducts = product_data.filter((product) => {
          const existingProductIds = existingProducts.map((p) => p.product_id);
          return !existingProductIds.includes(product.product_id);
        });

        const createdProducts = await Product.bulkCreate(newProducts, {
          validate: true,
          transaction,
        });

        const productIds = [
          ...existingProductIds,
          ...createdProducts.map((product) => product.id),
        ];
        const bundleId = createdBundle.id;

        const bundle_product_data = productIds.map((productId) => ({
          bundleId: bundleId,
          productId: productId,
        }));

        await BundleProduct.bulkCreate(bundle_product_data, {
          validate: true,
          transaction,
        });

        resolve({
          id: req.response.productId,
          message: "Bundle created successfully",
          status: true,
        });
        return;
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default BundleProductCreate;
