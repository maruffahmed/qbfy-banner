import React from "react";
import {
  Card,
  Layout,
  ResourceList,
  SkeletonBodyText,
  SkeletonPage,
  TextStyle,
} from "@shopify/polaris";
import ProductItem from "./ProductItem";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

function ProductList({ productsIds }) {
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids: productsIds },
  });
  if (loading) {
    return (
      <SkeletonPage primaryAction secondaryActions={2}>
        <Layout>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
                <SkeletonBodyText lines={1} />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }
  if (error){
    return <TextStyle variation={"strong"}>Error : {error.message}</TextStyle>;
  }
  return (
    <ResourceList
      showHeader
      resourceName={{ singular: "product", plural: "products" }}
      items={data?.nodes}
      renderItem={(item) => {
        return <ProductItem product={item} />;
      }}
    />
  );
}

export default ProductList;
