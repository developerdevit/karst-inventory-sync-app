import { Spinner } from '@shopify/polaris';
import React from 'react';

function Loader({ loading = false }) {
  if (!loading) {
    return null;
  }

  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner />
    </div>
  );
}

export default Loader;
