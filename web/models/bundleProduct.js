import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BundleProduct = sequelize.define("bundle_products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

export default BundleProduct;
