import React from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import ProductPage from "../components/product/ProductPage";
import ProductEmptyState from "../components/product/ProductEmptyState";
import store from "store-js";

const Index = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedProductsIds, setSelectedProductsIds] = React.useState([]);

  React.useEffect(() => {
    const localProductsIds = store.get(`qbyt-banner-products`);
    if (localProductsIds) {
      setSelectedProductsIds(localProductsIds);
    }
  }, []);
  const handleResourceSelect = (resource) => {
    setIsOpen(false);
    const productsIds = resource.selection?.map((product) => product.id);
    if (productsIds) {
      setSelectedProductsIds(productsIds);
      store.set(`qbyt-banner-products`, productsIds);
    }
  };
  return (
    <>
      <ResourcePicker
        resourceType="Product"
        showVariants = {false}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onSelection={handleResourceSelect}
        initialSelectionIds={selectedProductsIds}
      />
      {selectedProductsIds.length ? (
        <ProductPage setIsOpen={setIsOpen} productsIds={selectedProductsIds} />
      ) : (
        <ProductEmptyState setIsOpen={setIsOpen} />
      )}
    </>
  );
};

export default Index;
