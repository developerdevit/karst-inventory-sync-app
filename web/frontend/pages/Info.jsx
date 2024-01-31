import { useState } from 'react';
import { Card, Page, Layout, BlockStack, Text } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

import LogFilesList from '../components/LogFilesList';
import Loader from '../components/Loader';
import { useAuthenticatedFetch } from '../hooks';
import { prepareInfoData } from '../utils/prepareInfoData';

export default function InfoPage() {
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState([]);
  const [data, setData] = useState(null);

  const fetch = useAuthenticatedFetch();

  const fetchInfo = () => {
    try {
      setLoading(true);
      setData(null);

      fetch('/api/info', {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success && res?.data) {
            setData(res?.data);
          }
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.log('fetchInfo error: ', error);
    }
  };

  const fetchTest = () => {
    try {
      setLoading(true);

      fetch('/api/test', {
        method: 'GET',
      }).finally(() => setLoading(false));
    } catch (error) {
      console.log('fetchTest error: ', error);
    }
  };

  const fetchRemoveLocations = () => {
    try {
      setLoading(true);

      fetch('/api/remove-old-locations', {
        method: 'DELETE',
      }).finally(() => setLoading(false));
    } catch (error) {
      console.log('fetchRemoveLocations error: ', error);
    }
  };

  const fetchDownloadFile = (fileName, idx) => {
    try {
      setFileLoading((cur) =>
        cur.map((_, index) => (index === idx ? true : false))
      );
      fetch(`/api/download-logs?fileName=${fileName}`, {
        method: 'GET',
        headers: {
          Accept: 'text/plain',
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .finally(() => setFileLoading((cur) => cur.map(() => false)));
    } catch (error) {
      console.log('fetchDownloadFile error: ', error);
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar
        title={'Inventory Sync App'}
        secondaryActions={[
          {
            content: 'Fetch info',
            destructive: false,
            onAction: fetchInfo,
            loading: loading,
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
              <Loader loading={loading} />
              {data && (
                <>
                  <div style={{ marginTop: '1rem' }}>
                    <Text as='h2' variant='headingMd'>
                      VPS instance status:
                    </Text>
                    <div style={{ marginTop: '0.25rem' }}>
                      {prepareInfoData(data?.serverStatus)}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <Text as='h2' variant='headingMd'>
                      Redis storage status:
                    </Text>
                    <div style={{ marginTop: '0.25rem' }}>
                      {prepareInfoData(data?.info)}
                    </div>
                  </div>
                  {data?.files && Array.isArray(data?.files) && (
                    <div style={{ marginTop: '1rem' }}>
                      <Text as='h2' variant='headingMd'>
                        Logs files:
                      </Text>

                      <LogFilesList
                        data={data}
                        fileLoading={fileLoading}
                        fetchDownloadFile={fetchDownloadFile}
                      />
                    </div>
                  )}
                </>
              )}
              {!data && !loading && (
                <p style={{ marginTop: '0.5rem' }}>No data fetched...</p>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
