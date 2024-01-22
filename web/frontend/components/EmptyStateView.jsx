import { EmptyState } from '@shopify/polaris';
import React from 'react';

function EmptyStateView({ loading, data, error, handleRunScript = () => {} }) {
  if (error) {
    return (
      <EmptyState
        heading='Something went wrong'
        image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
        action={{
          content: 'Run sync script',
          destructive: false,
          onAction: handleRunScript,
          loading: loading,
        }}
      >
        <code>{error}</code>
        <p>Please try again.</p>
      </EmptyState>
    );
  }

  if (data) {
    return null;
  }

  return (
    <EmptyState
      heading={loading ? 'Script is running' : 'No data'}
      image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
      action={{
        content: 'Run sync script',
        destructive: false,
        onAction: handleRunScript,
        loading: loading,
      }}
    >
      <p>
        {loading
          ? 'Preparing locations and product variants. This may take some time...'
          : 'Please run the script to synchronize initial Shopify data with Sanity.'}
      </p>
    </EmptyState>
  );
}

export default EmptyStateView;
