import { Card, Page, Layout, BlockStack } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

import { useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import { LocationsView, VariantsView, EmptyStateView } from '../components';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetch = useAuthenticatedFetch();

  const handleRunScript = () => {
    try {
      setLoading(true);
      setError(null);

      fetch('/api/run-sync-script', {
        method: 'POST',
      })
        .then(async (res) => {
          if (res.ok) {
            const resJson = await res.json();

            if (resJson?.success && resJson?.data) {
              setData(resJson?.data);
            } else {
              setError('No data');
            }
          }
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.log('handleRunScript error: ', error);
    }
  };

  const fetchTest = () => {
    try {
      fetch('/api/add-job', {
        method: 'POST',
        body: JSON.stringify({ id: '123123', name: 'test123' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => console.log('test res', JSON.stringify(res, null, 2)));
      // .finally(() => setLoading(false));
    } catch (error) {
      console.log('test error: ', error);
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar
        title={'Inventory Sync App'}
        // secondaryActions={[
        //   {
        //     content: 'Fetch test',
        //     destructive: false,
        //     onAction: fetchTest,
        //   },
        // ]}
      />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack>
              <LocationsView data={data} />
              <VariantsView data={data} />

              <EmptyStateView
                data={data}
                loading={loading}
                error={error}
                handleRunScript={handleRunScript}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
