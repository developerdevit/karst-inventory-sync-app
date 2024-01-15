import { bulkOperationResultQuery } from '../graphql/queries/locations.js';

export async function fetchBulkOperationResult(client) {
  try {
    const bulkOperationResultResponse = await client.query({
      data: {
        query: bulkOperationResultQuery,
      },
    });

    const data = await bulkOperationResultResponse.body;

    return data?.data?.currentBulkOperation?.url;
  } catch (error) {
    console.log('fetchBulkOperationResult error: ', error);
    return null;
  }
}
