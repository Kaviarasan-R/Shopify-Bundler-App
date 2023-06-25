import shopify from "../shopify.js";
import bundleProductEdit from "../controllers/bundleProductEdit.js";

const FETCH_PRODUCT_MEDIA = `
query product($id: ID!) {
  product(id: $id) {
    media(first: 100) {
      edges {
        node {
          ...on MediaImage {
            id
          }
          preview {
            image {
              url
            }
          }
        }
      }
    }
  }
}
`;

const DELETE_PRODUCT_MEDIA = `
mutation productDeleteMedia($mediaIds: [ID!]!,$productId: ID!) {
  productDeleteMedia(
		mediaIds: $mediaIds, 
		productId: $productId
  ) {
    deletedMediaIds
  }
}
`;

const CREATE_PRODUCT_MEDIA = `
mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
  productCreateMedia(
		productId: $productId, 
    media: $media
  ) {
    product {
      title
    }
  }
}
`;

const UPDATE_PRODUCT_MUTATION = `
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;

function formatGqlMediaIdResponse(res) {
  const response = res.body.data.product?.media?.edges;
  return response.map((data) => data.node.id);
}

export default async function editBundles(body, session) {
  try {
    let message = "Bundle is edited successfully";
    let status = false;
    let error = "";

    const client = new shopify.api.clients.Graphql({ session });
    await client.query({
      data: {
        query: UPDATE_PRODUCT_MUTATION,
        variables: {
          input: {
            id: body.productId,
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
        },
      },
    });
    const fetchedAllMediaIds = await client.query({
      data: {
        query: FETCH_PRODUCT_MEDIA,
        variables: {
          id: body.productId,
        },
      },
    });
    const formattedFetchedAllMediaIds =
      formatGqlMediaIdResponse(fetchedAllMediaIds);

    await client.query({
      data: {
        query: DELETE_PRODUCT_MEDIA,
        variables: {
          mediaIds: formattedFetchedAllMediaIds,
          productId: body.productId,
        },
      },
    });

    await client.query({
      data: {
        query: CREATE_PRODUCT_MEDIA,
        variables: {
          productId: body.productId,
          media: body.media.map((url) => {
            return {
              originalSource: url,
              mediaContentType: "IMAGE",
            };
          }),
        },
      },
    });

    const result = await bundleProductEdit(body);
    message = result.message;
    status = result.status;
    error = result.error;

    return { message, status, error };
  } catch (err) {
    console.log(err);
  }
}
