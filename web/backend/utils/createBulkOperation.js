import { bulkOperationRunQuery } from '../graphql/queries/locations.js';

export async function createBulkOperation(client) {
  try {
    const bulkRunResponse = await client.query({
      data: {
        query: bulkOperationRunQuery,
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
