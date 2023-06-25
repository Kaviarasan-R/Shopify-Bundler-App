import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BundleRule = sequelize.define("bundle_rules", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_products: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  min_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default BundleRule;
