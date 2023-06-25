import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Bundle from "../models/bundle.js";
import Product from "../models/product.js";
import BundleProduct from "../models/bundleProduct.js";

const rearrangeBundleProductData = (
  bundleId,
  existingProductTitleAndID,
  productData
) => {
  const bundleProductData = [];

  productData.forEach((products, index) => {
    existingProductTitleAndID.forEach((existingProducts) => {
      if (products.title === existingProducts.title) {
        bundleProductData.push({
          bundleId: bundleId,
          productId: existingProducts.id,
        });
        return;
      }
    });
  });
  return bundleProductData;
};

const BundleProductEdit = async (body) => {
  const productData = body.selectedProducts.map((data) => ({
    product_id: data.id,
    title: data.title,
    image: data.url,
    price: Number(data.price),
  }));

  const bundleData = {
    name: body.name,
    title: body.title,
    description: body.description,
    status: body.status,
    discount_type: Array.isArray(body.discountType)
      ? body.discountType[0]
      : body.discountType,
    discount_value: Number(body.discountValue),
    price_after_discount: Number(body.price), // price
    total_product_price: Number(body.totalBundlePrice), // totalBundlePrice
    total_saved_price: Number(body.savedBundlePrice), // savedBundlePrice
    product_type: "bundle",
    performance: Number(body.performance),
  };

  const productId = body.productId;
  const bundleId = body.bundleId;

  return new Promise((resolve, reject) => {
    sequelize.transaction(async (transaction) => {
      try {
        /* UPDATE BUNDLE */

        await Bundle.update(bundleData, {
          where: {
            product_id: productId,
          },
          validate: true,
          returning: true,
          transaction,
        });

        /* DELETE EXISTING BUNDLE_PRODUCT MAPPINGS FOR THE GIVEN BUNDLE ID */

        await BundleProduct.destroy({
          where: {
            bundleId: bundleId,
          },
          transaction,
        });

        /* CHECK FOR EXISTING PRODUCTS IN PRODUCT TABLE */

        const existingProducts = await Product.findAll({
          where: {
            product_id: {
              [Op.in]: productData.map((product) => product.product_id),
            },
          },
          attributes: ["id", "product_id", "title"],
          raw: true,
          transaction,
        });

        const existingProductTitleAndID = existingProducts.map((product) => ({
          id: product.id,
          title: product.title,
        }));

        /* CREATE NEW PRODUCTS IF THEY DON'T EXIST */

        const newProducts = productData.filter((product) => {
          const existingProductIds = existingProducts.map((p) => p.product_id);
          return !existingProductIds.includes(product.product_id);
        });

        if (newProducts.length > 0) {
          const createdProducts = await Product.bulkCreate(newProducts, {
            validate: true,
            transaction,
          });

          existingProductTitleAndID.push(
            ...createdProducts.map((product) => ({
              id: product.id,
              title: product.title,
            }))
          );
        }

        /* REARRANGE bundleProductData TO MATCH THE ORDER OF EXISTING PRODUCTS */

        const rearrangedBundleProductData = rearrangeBundleProductData(
          bundleId,
          existingProductTitleAndID,
          productData
        );

        /* CREATE BUNDLE_PRODUCT MAPPINGS */

        await BundleProduct.bulkCreate(rearrangedBundleProductData, {
          validate: true,
          transaction,
        });

        resolve({
          message: "Bundle updated successfully",
          status: true,
          error: "",
        });
        return;
      } catch (err) {
        reject({
          message: "Unable to update bundle",
          status: false,
          error: err,
        });
      }
    });
  });
};

export default BundleProductEdit;
