import sequelize from "../config/database.js";
import BundleRule from "../models/bundleRule.js";

const BundleRuleCreate = async (body) => {
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

        const existingBundle = await BundleRule.findOne({
          where: {
            name: bundle_rule_data.name,
          },
          transaction,
        });

        if (existingBundle) {
          resolve({ message: "Bundle rule already exists", status: false });
          return;
        }

        await BundleRule.create(bundle_rule_data, {
          validate: true,
          transaction,
        });

        resolve({ message: "Bundle rule created successfully", status: true });
        return;
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default BundleRuleCreate;
