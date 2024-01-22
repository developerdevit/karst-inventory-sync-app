const GET_INVENTORY_LEVELS_BY_LOCATION_ID = `
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

const BULK_OPERATION_RUN_QUERY = `
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

const BULK_OPERATION_RESULT_QUERY = `
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
  GET_INVENTORY_LEVELS_BY_LOCATION_ID,
  BULK_OPERATION_RUN_QUERY,
  BULK_OPERATION_RESULT_QUERY,
};
