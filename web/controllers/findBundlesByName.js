import sequelize from "../config/database.js";
import { Op } from "sequelize";
import Bundle from "../models/bundle.js";

const findBundlesByName = async (nameQuery, titleQuery) => {
  try {
    const bundles = await Bundle.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
            [Op.eq]: nameQuery.toLowerCase(),
          }),
          sequelize.where(sequelize.fn("LOWER", sequelize.col("title")), {
            [Op.eq]: titleQuery.toLowerCase(),
          }),
        ],
      },
    });
    return bundles.length > 0; // Returns true if any bundle is found
  } catch (error) {
    throw error;
  }
};

export default findBundlesByName;
