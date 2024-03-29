import { BULK_OPERATION_RUN_QUERY } from '../graphql/queries/locations.graphql.js';

export async function createBulkOperation(client) {
  try {
    const bulkRunResponse = await client.query({
      data: {
        query: BULK_OPERATION_RUN_QUERY,
      },
    });

    const bulkOperationRunData = await bulkRunResponse.body;

    const bulkOperationId =
      bulkOperationRunData?.data?.bulkOperationRunQuery?.bulkOperation?.id;

    return bulkOperationId;
  } catch (error) {
    console.log('createBulkOperation error: ', error);
    return null;
  }
}
