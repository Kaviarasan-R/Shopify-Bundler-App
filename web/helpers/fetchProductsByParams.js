import shopify from "../shopify.js";

const FETCH_PRODUCTS_BY_QUERY = `
query Products($first: Int, $query: String) {
  products(
		first: $first,
    query: $query
		) {
    edges {
      node {
        id
        title
        tags
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
  }
}
`;

const formatGqlResponse = (res) => {
  const edges = res?.body?.data?.products?.edges || [];
  if (!edges.length) return [];
  const nodes = edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    url: node.images.edges[0]?.node?.url,
    price: node.priceRangeV2.maxVariantPrice.amount,
  }));
  return nodes;
};

function generateSearchQuery(body) {
  const { tags, min_price, max_price } = body;
  const tagQuery = tags.map((tag) => `(tag:${tag})`).join(" OR ");
  const priceQuery = `(price:>=${min_price} price:<=${max_price})`;

  return `(${tagQuery}) AND ${priceQuery}`;
}

export default async function fetchProductsByParams(body, session) {
  let status = false;
  try {
    const client = new shopify.api.clients.Graphql({ session });
    const queryValue = generateSearchQuery(body);

    const response = await client.query({
      data: {
        query: FETCH_PRODUCTS_BY_QUERY,
        variables: {
          first: body.total_products,
          query: queryValue,
        },
      },
    });

    const formattedResponse = formatGqlResponse(response);
    if (response) {
      status = true;
    }

    return { result: formattedResponse, status: status };
  } catch (err) {
    throw err;
  }
}
