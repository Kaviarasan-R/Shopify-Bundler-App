import shopify from "../shopify.js";
import BundleProductCreate from "../controllers/bundleProductCreate.js";
import findBundlesByName from "../controllers/findBundlesByName.js";

const CREATE_PRODUCT_MUTATION = `
mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]!) {
	productCreate(input: $input, media: $media) {
		product {
      id
      title
      productType
      vendor
      status
      createdAt
      updatedAt
      variants(first: 1) {
        edges {
          node {
            price
            compareAtPrice
            inventoryQuantity
          }
        }
      }
    }
  }
}
`;

const PUBLISH_PRODUCT = `
mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, 
	input: $input) {
    publishable {
      publicationCount
    }
    shop {
      name
    }
  }
}
`;

const formatGqlResponse = (res) => {
  const val = res.body.data.productCreate.product;
  return {
    productId: val.id,
    createdAt: val.createdAt,
    updatedAt: val.updatedAt,
    status: val.status,
  };
};

export default async function productCreate(session, body) {
  let message = "Bundle is already exists";
  let status = false;
  let error = "";
  let bundleId = "";
  const nameQuery = body.name;
  const titleQuery = body.title;
  const isBundlePresent = await findBundlesByName(nameQuery, titleQuery);
  if (!isBundlePresent) {
    try {
      const client = new shopify.api.clients.Graphql({ session });
      await client
        .query({
          data: {
            query: CREATE_PRODUCT_MUTATION,
            variables: {
              input: {
                title: body.title,
                descriptionHtml: body.description,
                productType: body.productType,
                vendor: body.vendor,
                status: body.status,
                variants: [
                  {
                    inventoryItem: {
                      tracked: true,
                    },
                    inventoryQuantities: [
                      {
                        availableQuantity: 100,
                        locationId: "gid://shopify/Location/85339537717",
                      },
                    ],
                    price: body.price,
                    compareAtPrice: body.comparedAtPrice,
                  },
                ],
              },
              media: body.media.map((url) => {
                return {
                  originalSource: url,
                  mediaContentType: "IMAGE",
                };
              }),
            },
          },
        })
        .then(async (response) => {
          try {
            const result = await BundleProductCreate({
              body,
              response: formatGqlResponse(response),
            });
            bundleId = result.id;
            message = result.message;
            status = result.status;
          } catch (err) {
            error = err;
            status = false;
          }
        })
        .then(async () => {
          try {
            await client
              .query({
                data: {
                  query: PUBLISH_PRODUCT,
                  variables: {
                    id: bundleId,
                    input: [
                      {
                        publicationId: "gid://shopify/Publication/165682118965",
                      },
                    ],
                  },
                },
              })
              .catch((err) => console.log(err));
          } catch (err) {
            error = err;
            status = false;
          }
        });

      return { message, status, error };
    } catch (err) {
      throw err;
    }
  }
  return { message, status, error };
}
