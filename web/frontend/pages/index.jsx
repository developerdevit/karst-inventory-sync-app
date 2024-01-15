import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  Spinner,
  EmptyState,
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { useTranslation, Trans } from 'react-i18next';

import { trophyImage } from '../assets';
import { useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';
import {
  extractLocations,
  extractVariants,
} from '../utils/readableDataHelpers';

const mock = {
  success: true,
  data: {
    data: {
      locationsArr: [
        {
          id: '73742483712',
          name: 'another new test location',
          countryCode: 'GE',
        },
        { id: '73318596864', name: 'Shop location', countryCode: 'UA' },
        { id: '73318793472', name: 'Sydney Warehouse', countryCode: 'AU' },
        {
          id: '73318826240',
          name: 'Washington DC Warehouse',
          countryCode: 'US',
        },
      ],
      variantsWithLocations: [
        {
          variantId: '44179634749696',
          locations: [
            { id: '73318596864', quantity: 22 },
            { id: '73318793472', quantity: 19 },
            { id: '73318826240', quantity: 10 },
          ],
        },
        {
          variantId: '44179634782464',
          locations: [
            { id: '73318596864', quantity: 30 },
            { id: '73318793472', quantity: 5 },
            { id: '73318826240', quantity: 3 },
          ],
        },
        {
          variantId: '44179634815232',
          locations: [
            { id: '73318596864', quantity: 10 },
            { id: '73318793472', quantity: 7 },
            { id: '73318826240', quantity: 7 },
          ],
        },
        {
          variantId: '44179634848000',
          locations: [
            { id: '73318596864', quantity: 15 },
            { id: '73318793472', quantity: 5 },
            { id: '73318826240', quantity: 5 },
          ],
        },
        {
          variantId: '44179650806016',
          locations: [
            { id: '73318596864', quantity: 5 },
            { id: '73318793472', quantity: 5 },
            { id: '73318826240', quantity: 3 },
          ],
        },
        {
          variantId: '44179650838784',
          locations: [
            { id: '73318596864', quantity: 5 },
            { id: '73318793472', quantity: 8 },
            { id: '73318826240', quantity: 8 },
          ],
        },
        {
          variantId: '44179650871552',
          locations: [
            { id: '73318596864', quantity: 10 },
            { id: '73318793472', quantity: 11 },
            { id: '73318826240', quantity: 11 },
          ],
        },
        {
          variantId: '44179651330304',
          locations: [
            { id: '73318596864', quantity: 40 },
            { id: '73318793472', quantity: 54 },
            { id: '73318826240', quantity: 64 },
          ],
        },
        {
          variantId: '44179651363072',
          locations: [
            { id: '73318596864', quantity: 27 },
            { id: '73318793472', quantity: 37 },
            { id: '73318826240', quantity: 47 },
          ],
        },
        {
          variantId: '44179651395840',
          locations: [
            { id: '73318596864', quantity: 15 },
            { id: '73318793472', quantity: 25 },
            { id: '73318826240', quantity: 35 },
          ],
        },
      ],
    },
  },
};

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

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
      console.log('test');

      // setLoading(true);

      fetch('/api/test', {
        method: 'GET',
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
        primaryAction={{
          content: 'Run sync script',
          destructive: false,
          onAction: handleRunScript,
          loading: loading,
        }}
        secondaryActions={[
          {
            content: 'Fetch test',
            destructive: false,
            onAction: fetchTest,
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing='extraTight'
              distribution='trailing'
              alignment='center'
            >
              <Stack.Item fill>
                <TextContainer spacing='loose'>
                  <Text as='h2' variant='headingMd'>
                    Locations and Product Variants
                  </Text>
                  {loading ? (
                    <>
                      <p>
                        Preparing inventory locations and product variants
                        data...
                      </p>
                      <p style={{ marginTop: 0 }}>This may take some time.</p>
                      <div
                        style={{
                          width: '100%',
                          margin: '2rem auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Spinner />
                      </div>
                    </>
                  ) : (
                    <>
                      {data ? (
                        <>
                          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>
                            Locations:
                          </h3>
                          <ul style={{ marginTop: 0, listStyle: 'none' }}>
                            {extractLocations(data)?.map((str, idx) => (
                              <li key={idx}>{str}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                      {data ? (
                        <>
                          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>
                            Variants:
                          </h3>
                          <ul style={{ marginTop: 0 }}>
                            {extractVariants(data)?.map((variant, idx) => (
                              <li
                                key={idx}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                <p style={{ fontWeight: 600 }}>
                                  {variant?.title}
                                </p>
                                {variant?.locations?.map((loc) => (
                                  <span
                                    key={loc}
                                    style={{ paddingLeft: '0.25rem' }}
                                  >
                                    {loc}
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <EmptyState
                          heading='No data'
                          image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
                        >
                          <p>
                            Please run the script to synchronize initial Shopify
                            data with Sanity.
                          </p>
                        </EmptyState>
                      )}
                    </>
                  )}
                </TextContainer>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
