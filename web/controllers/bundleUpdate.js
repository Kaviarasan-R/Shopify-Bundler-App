import sequelize from "../config/database.js";
import Bundle from "../models/bundle.js";

const BundleUpdate = async (data) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (transaction) => {
      try {
        const updatedBundles = [];

        for (const bundleData of data) {
          const { product_id, quantity } = bundleData;

          const bundle = await Bundle.findOne({
            where: {
              product_id: product_id,
            },
          });

          if (bundle) {
            bundle.performance += quantity;
            await bundle.save({ transaction });

            const totalProductPrice = bundle.total_product_price;
            updatedBundles.push({ product_id, totalProductPrice });
          }
        }

        resolve({
          message: "Bundles updated successfully",
          status: true,
          updatedBundles,
        });
        return;
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default BundleUpdate;
