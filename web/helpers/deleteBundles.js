import shopify from "../shopify.js";
import deleteSelectedBundles from "../controllers/deleteSelectedBundles.js";

const DELETE_PRODUCT_MUTATION = `
mutation productDelete($input: ProductDeleteInput!) {
  productDelete(input: $input) {
    deletedProductId
    userErrors {
      field
      message
    }
  }
}
`;

export default async function fetchBundles(body, session) {
  let success = false;
  let error = "";
  try {
    const client = new shopify.api.clients.Graphql({ session });
    for (const productId of body) {
      await client
        .query({
          data: {
            query: DELETE_PRODUCT_MUTATION,
            variables: {
              input: {
                id: productId,
              },
            },
          },
        })
        .then(async () => {
          const response = await deleteSelectedBundles(productId);
          if (response) (success = true), (error = "");
        })
        .catch((error) => {
          error = error;
          success = false;
        });
    }
    return { success: success, error: error };
  } catch (err) {
    console.log(err);
  }
}
