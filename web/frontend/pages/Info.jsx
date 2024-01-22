import {
  Card,
  Page,
  Layout,
  Image,
  BlockStack,
  Link,
  Text,
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

import { useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';

export default function InfoPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetch = useAuthenticatedFetch();

  const handleRunScript = () => {
    try {
      console.log('handleRunScript');

      setLoading(true);

      fetch('/api/run-sync-script', {
        method: 'POST',
        body: JSON.stringify({ test: true }),
      })
        .then((res) => res.json())
        .then((res) => setData(res))
        .finally(() => setLoading(false));
    } catch (error) {
      console.log('handleRunScript error: ', error);
    }
  };

  const fetchTest = () => {
    try {
      console.log('info');

      // setLoading(true);

      fetch('/api/info', {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success && res?.data) {
            setData(res?.data);
          }
        });
      // .finally(() => setLoading(false));
    } catch (error) {
      console.log('info error: ', error);
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar
        title={'Inventory Sync App'}
        // primaryAction={{
        //   content: 'Run sync script',
        //   destructive: false,
        //   onAction: handleRunScript,
        //   loading: loading,
        // }}
        secondaryActions={[
          {
            content: 'Fetch info',
            destructive: false,
            onAction: fetchTest,
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack>
              <Text as='h2' variant='headingLg'>
                Info
              </Text>
              {data && <code>{data}</code>}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
