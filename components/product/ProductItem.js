import React from "react";
import { ResourceItem, Stack, TextStyle, Thumbnail } from "@shopify/polaris";
import { CircleDisabledMajor } from "@shopify/polaris-icons";

function ProductItem({ product }) {
  const { id, title, variants, images } = product;
  const price = variants.edges[0].node.price;
  const imageSource = images.edges.length ? images.edges[0]?.node.originalSrc : null;
  const thumb = imageSource ? (
    <Thumbnail size="medium" alt={title} source={imageSource} />
  ) : (
    <Thumbnail size="medium" source={CircleDisabledMajor} alt="no thumbnail" />
  );
  return (
    <ResourceItem
      id={id}
      accessibilityLabel={`View details for ${title}`}
      name={title}
      media={thumb}
    >
      <Stack>
        <Stack.Item fill>
          <h4>
            <TextStyle variation="strong">{title}</TextStyle>
          </h4>
        </Stack.Item>
        <Stack.Item>
          <p>
            <TextStyle variation="strong">{price}</TextStyle>
          </p>
        </Stack.Item>
      </Stack>
    </ResourceItem>
  );
}

export default ProductItem;
