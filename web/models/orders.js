import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Orders = sequelize.define("orders", {
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
  customer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bundles_total_sales_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orders_total_sales_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_sales_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Orders;
