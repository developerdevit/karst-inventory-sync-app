import { Button } from '@shopify/polaris';
import React from 'react';

function LogFilesList({ data, fetchDownloadFile, fileLoading }) {
  return (
    <ul
      style={{
        margin: '0.25rem 0 0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        listStyle: 'none',
        paddingLeft: 0,
      }}
    >
      {data?.files
        ?.filter((file) => file?.includes('.log'))
        .map((file, idx) => {
          return (
            <Button
              onClick={() => fetchDownloadFile(file, idx)}
              loading={fileLoading?.[idx]}
              key={`${file}-${idx}`}
              disabled={fileLoading?.some((item) => item === true)}
            >
              {file}
            </Button>
          );
        })}
    </ul>
  );
}

export default LogFilesList;
