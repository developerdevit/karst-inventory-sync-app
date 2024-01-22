import React from 'react';
import { extractLocations } from '../utils/readableDataHelpers';
import { Text } from '@shopify/polaris';

function LocationsView({ data }) {
  if (!data) {
    return null;
  }

  const items = extractLocations(data);

  return (
    <>
      <Text as='h2' variant='headingLg'>
        Locations and Product Variants
      </Text>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginTop: '12px' }}>
        Locations:
      </h3>
      {items?.length ? (
        <ul style={{ marginTop: 0, listStyle: 'none' }}>
          {items?.map((str, idx) => (
            <li key={idx}>{str}</li>
          ))}
        </ul>
      ) : (
        <p>Data not found...</p>
      )}
    </>
  );
}

export default LocationsView;
