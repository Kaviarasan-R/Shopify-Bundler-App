import sequelize from "../config/database.js";
import BundleRule from "../models/bundleRule.js";

const editBundleRulesById = async (body) => {
  try {
    const id = body.id;
    const bundle_rule_data = {
      name: body.name,
      tags: body.tags.join(","),
      discount_type: body.discount_type,
      discount_value: Number(body.discount_value),
      total_products: Number(body.total_products),
      min_price: Number(body.min_price),
      max_price: Number(body.max_price),
    };

    return new Promise((resolve, reject) => {
      sequelize.transaction(async (transaction) => {
        try {
          await BundleRule.sync();
          await BundleRule.update(bundle_rule_data, {
            where: {
              id: id,
            },
            transaction,
          });

          resolve({
            message: "Bundle rule updated successfully",
            status: true,
          });
          return;
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export default editBundleRulesById;
