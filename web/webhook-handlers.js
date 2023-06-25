import { DeliveryMethod } from "@shopify/shopify-api";
import shopify from "./shopify.js";
import bundleOrders from "./helpers/bundleOrders.js";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      const created_date = payload.created_at;
      const order_name = payload.name;
      const customer_id = payload.customer?.id ?? "";
      const final_data = payload?.line_items
        .filter((product) => product.vendor === "Bundler")
        .map((product) => ({
          product_id: `gid://shopify/Product/${product.product_id}`,
          customer_id:
            customer_id !== ""
              ? `gid://shopify/Customer/${payload.customer.id}`
              : "",
          date: created_date,
          order_name: order_name,
          title: product.title,
          quantity: product.quantity,
          bundles_total_sales_value: product.quantity * Number(product.price),
          orders_total_sales_value:
            product.quantity * Number(product.price) +
            Number(product.tax_lines[0].price),
        }));
      const sessionId = shopify.api.session.getOfflineId(shop);
      const session = await shopify.config.sessionStorage.loadSession(
        sessionId
      );
      const response = await bundleOrders(final_data, session);
      console.log("RES", response);
    },
  },
};
