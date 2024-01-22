import { BULK_OPERATION_RESULT_QUERY } from '../graphql/queries/locations.graphql.js';

export async function fetchBulkOperationResult(client) {
  try {
    const bulkOperationResultResponse = await client.query({
      data: {
        query: BULK_OPERATION_RESULT_QUERY,
      },
    });

    const data = await bulkOperationResultResponse.body;

    return data?.data?.currentBulkOperation?.url;
  } catch (error) {
    console.log('fetchBulkOperationResult error: ', error);
    return null;
  }
}
