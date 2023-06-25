import shopify from "../shopify.js";
import BundleOrderCreate from "../controllers/bundleOrderCreate.js";
import BundleUpdate from "../controllers/bundleUpdate.js";

const FETCH_CUSTOMER = `
query customer($id: ID!) {
  customer(id: $id) {
    firstName
    lastName
  }
}`;

export default async function bundleOrders(body, session) {
  let message = "Failed To Update In DB";
  let status = false;
  let customer_name = "";
  try {
    const client = new shopify.api.clients.Graphql({ session });
    if (body[0].customer_id) {
      await client
        .query({
          data: {
            query: FETCH_CUSTOMER,
            variables: {
              id: body[0].customer_id,
            },
          },
        })
        .then((res) => {
          const { firstName, lastName } = res.body.data.customer;
          customer_name = `${firstName} ${lastName}`;
        });
    }
    await BundleUpdate(body).then((res) => {
      status = res.status;
      for (let i = 0; i < body.length; i++) {
        const bodyObject = body[i];

        const updatedBundle = res.updatedBundles.find(
          (bundle) => bundle.product_id === bodyObject.product_id
        );

        const total_sales_value =
          updatedBundle.totalProductPrice * bodyObject.quantity;

        bodyObject.total_sales_value = total_sales_value;
        bodyObject.customer = customer_name;
      }
    });
    await BundleOrderCreate(body).then((res) => {
      message = res.message;
      status = res.status;
    });
    return { message, status };
  } catch (err) {
    throw err;
  }
}
