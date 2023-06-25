import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Bundle = sequelize.define("bundles", {
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
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
  price_after_discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_product_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_saved_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performance: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Bundle;
