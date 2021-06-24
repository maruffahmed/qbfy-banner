import { EmptyState } from '@shopify/polaris';
import React from 'react';

function ProductEmptyState({setIsOpen}) {
    return (
        <EmptyState 
          heading = "Select Banner Product"
          action = {{
            content : "Select Product",
            onAction : () => setIsOpen(true)
          }}
          image = "https://cdn.shopify.com/shopifycloud/partners/assets/admin/empty-states-fresh/partners-generic-df54927807fc27d4c5cab379ebfed287002aefd3a468b6f6fd1d6ee86a70086d.svg"
          fullWidth = {true}
          >
            <p>Select products that you want to show in the banner.</p>
          </EmptyState>
    );
}

export default ProductEmptyState;