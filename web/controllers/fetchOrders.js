import Bundle from "../models/bundle.js";
import Orders from "../models/orders.js";
import moment from "moment";
import { Op } from "sequelize";

const fetchOrders = async (body) => {
  try {
    const { selectedFromDate, selectedToDate } = body;
    const formattedStartDate = moment(selectedFromDate).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = moment(selectedToDate).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const uniqueOrderNames = await Orders.aggregate("name", "DISTINCT", {
      plain: false,
    });
    const totalBundlesSold = await Bundle.sum("performance");
    const totalBundles = await Bundle.count();
    const totalOrders = uniqueOrderNames.length;

    const whereCondition =
      formattedStartDate === formattedEndDate
        ? {
            createdAt: {
              [Op.gte]: formattedStartDate,
              [Op.lt]: moment(formattedStartDate)
                .add(1, "day")
                .format("YYYY-MM-DD HH:mm:ss"),
            },
          }
        : {
            createdAt: {
              [Op.between]: [formattedStartDate, formattedEndDate],
            },
          };

    const order = await Orders.findAll({
      where: whereCondition,
      validate: true,
    });

    const bundlesTotalSalesValue = await Orders.sum(
      "bundles_total_sales_value",
      {
        where: whereCondition,
      }
    );
    const ordersTotalSalesValue = await Orders.sum("orders_total_sales_value", {
      where: whereCondition,
    });
    const totalSalesValue = await Orders.sum("total_sales_value", {
      where: whereCondition,
    });

    return {
      order,
      totalOrders,
      totalBundles,
      totalBundlesSold,
      bundlesTotalSalesValue,
      ordersTotalSalesValue,
      totalSalesValue,
    };
  } catch (error) {
    throw error;
  }
};

export default fetchOrders;
