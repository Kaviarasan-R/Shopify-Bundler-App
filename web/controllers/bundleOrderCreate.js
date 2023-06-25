import sequelize from "../config/database.js";
import Orders from "../models/orders.js";

const BundleOrder = async (data) => {
  const order_data = data.map((order) => ({
    product_id: order.product_id,
    name: order.order_name,
    title: order.title,
    customer: order.customer,
    items: order.quantity,
    bundles_total_sales_value: order.bundles_total_sales_value,
    orders_total_sales_value: order.orders_total_sales_value,
    total_sales_value: order.total_sales_value,
  }));

  return new Promise((resolve, reject) => {
    sequelize.transaction(async (transaction) => {
      try {
        await Orders.bulkCreate(order_data, { validate: true });
        resolve({
          message: "Order created successfully",
          status: true,
        });
        return;
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default BundleOrder;
