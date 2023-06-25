import BundleRule from "../models/bundleRule.js";
import { Op } from "sequelize";

const fetchAllBundleRules = async (pageNumber, sortPage, queryBundle) => {
  try {
    const itemsPerPage = 5;
    const offset = (pageNumber - 1) * itemsPerPage;
    const sortBy = sortPage;
    const whereConditions = {};

    if (queryBundle && queryBundle.trim() !== "") {
      whereConditions.name = { [Op.like]: `%${queryBundle}%` };
    }
    const bundleRules = await BundleRule.findAll({
      where: whereConditions,
      offset,
      limit: itemsPerPage,
      order: [["updatedAt", sortBy]],
    });
    const totalBundleRules = await BundleRule.count({
      where: whereConditions,
    });

    return { bundleRules, totalBundleRules };
  } catch (err) {
    throw err;
  }
};

export default fetchAllBundleRules;
