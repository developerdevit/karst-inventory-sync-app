const GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID = `
query($id: ID!, $inventoryLevelsCount: Int!, $names: [String!]!) {
    inventoryItem(id: $id){
        variant {
            id
        }
        inventoryLevels(first: $inventoryLevelsCount) {
            nodes {
                  location {
                    id
                  }
              quantities(names: $names) {
                quantity
              }
            }
        }
    }
}
`;

const GET_INVENTORY_ITEM_BY_ID = `
query($id: ID!) {
    inventoryItem(id: $id){
        variant {
            id
        }
    }
}
`;

const GET_INVENTORY_LEVELS_BY_FULFILLMENT_SERVICE_ID = `
query($id: ID!, $names: [String!]!) {
	fulfillmentService(id: $id) {
    location {
      id,
      inventoryLevels(first:250) {
        edges {
          node {
            item {
              id,
              variant {
                id,
              }
            }
            quantities(names: $names) {
              quantity,
            }
          }
        }
      }
    }
  }
}
`;

export {
  GET_INVENTORY_ITEM_WITH_LEVELS_BY_ID,
  GET_INVENTORY_ITEM_BY_ID,
  GET_INVENTORY_LEVELS_BY_FULFILLMENT_SERVICE_ID,
};
