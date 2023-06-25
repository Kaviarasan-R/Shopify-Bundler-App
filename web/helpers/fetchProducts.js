import shopify from "../shopify.js";

const formatGqlResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];
  const pageInfo = res?.body?.data?.products?.pageInfo;
  if (!edges.length) return [];
  const nodes = edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    image: node.images.edges[0]?.node?.url,
    price: node.priceRangeV2.maxVariantPrice.amount,
  }));
  return {
    data: nodes,
    page: { hasNextPage: pageInfo.hasNextPage, endCursor: pageInfo.endCursor },
  };
};

const isUndefined = (value) => {
  return value === undefined;
};

export default async function fetchProducts(session, title, cursor) {
  try {
    const client = new shopify.api.clients.Graphql({ session });

    const FETCH_PRODUCTS_LIST = `query ${
      cursor ? "products($after: String)" : ""
    }{
      products(first:5${
        cursor ? ", after: $after" : ""
      }, query: "NOT product_type:Bundle") {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            priceRangeV2 {
              maxVariantPrice {
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;

    const QUERY_PRODUCTS_LIST = `query products($query: String${
      cursor ? ",$after: String)" : ")"
    }{
      products(first:5,query: $query${cursor ? ", after: $after" : ""}) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            priceRangeV2 {
              maxVariantPrice {
                amount
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;

    let response = null;
    const titleType = isUndefined(title);
    const cursorType = isUndefined(cursor);

    if (!cursorType && !titleType) {
      /* TITLE WITH PAGINATION */
      response = await client.query({
        data: {
          query: QUERY_PRODUCTS_LIST,
          variables: {
            query: `(title:*${title}*) AND (NOT product_type:Bundle)`,
            after: cursor,
          },
        },
      });
    } else if (cursorType && !titleType) {
      /* TITLE WITH NO PAGINAITON */
      response = await client.query({
        data: {
          query: QUERY_PRODUCTS_LIST,
          variables: {
            query: `(title:*${title}*) AND (NOT product_type:Bundle)`,
          },
        },
      });
    } else if (!cursorType && titleType) {
      /* FETCHING ALL PRODUCTS WITH PAGINATION */
      response = await client.query({
        data: {
          query: FETCH_PRODUCTS_LIST,
          variables: {
            after: cursor,
          },
        },
      });
    } else if (cursorType && titleType) {
      /* FETCHING ALL PRODUCTS WITH NO PAGINATION */
      response = await client.query({
        data: FETCH_PRODUCTS_LIST,
      });
    }

    return formatGqlResponse(response);
  } catch (err) {
    throw err;
  }
}
