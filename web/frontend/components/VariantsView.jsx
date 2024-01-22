import React from 'react';
import { extractVariants } from '../utils/readableDataHelpers';

function VariantsView({ data }) {
  if (!data) {
    return null;
  }

  const items = extractVariants(data);

  return (
    <>
      <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Variants:</h3>
      {items?.length ? (
        <ul style={{ marginTop: 0 }}>
          {items?.map((variant, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '0.5rem',
              }}
            >
              <p style={{ fontWeight: 600 }}>{variant?.title}</p>
              {variant?.locations?.map((loc) => (
                <span key={loc} style={{ paddingLeft: '0.25rem' }}>
                  {loc}
                </span>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>Data not found...</p>
      )}
    </>
  );
}

export default VariantsView;
