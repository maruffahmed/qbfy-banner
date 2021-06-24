import { Page } from "@shopify/polaris";
import React from "react";
import ProductList from "./ProductList";

function ProductPage({ setIsOpen, productsIds }) {
  return (
    <Page
      title="Banner Products"
      primaryAction={{
        content: "Select Product",
        onAction: () => setIsOpen(true),
      }}
    >
      <ProductList productsIds={productsIds} />
    </Page>
  );
}

export default ProductPage;
