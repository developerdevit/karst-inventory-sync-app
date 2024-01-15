const getLocations = `
  {
    locations(first: 100) {
      nodes {
        name
        id
        address {
          countryCode
        }
      }
    }
  }
`;

const getInventoryLevelsByLocationId = `
    query($id: ID!) {
        location(id: $id){
            id
            inventoryLevels(first: 250) {
                nodes {
                    id
                    item {
                      id
                      variant {
                        id
                        title
                        inventoryQuantity
                      }
                    }
                }
            }
        }
    }
`;

const bulkOperationRunQuery = `
mutation {
    bulkOperationRunQuery(
      query:"""
      {
        locations {
          edges {
            node {
              id
              name
              address {
                countryCode
              }
              inventoryLevels {
                edges {
                  node {
                    id
                    available
                    item {
                      id
                      variant {
                        id
                        displayName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const bulkOperationResultQuery = `
  query {   
    currentBulkOperation {     
      id     
      status     
      errorCode                    
      fileSize     
      url   
    } 
  }
`;

export {
  getLocations,
  getInventoryLevelsByLocationId,
  bulkOperationRunQuery,
  bulkOperationResultQuery,
};
