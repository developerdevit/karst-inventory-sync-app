import { useEffect, useMemo, useState } from 'react';

import {
  Banner,
  useShippingAddress,
  reactExtension,
  SkeletonImage,
  useApi,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';

import { getCartVariantIds } from './helpers/getCartVariantIds';
import { fetchSanityVariantsByIds } from './api/fetchSanityVariantsByIds';
import { getNotInStockVariants } from './helpers/getNotInStockVariants';

export default reactExtension('purchase.checkout.block.render', () => (
  <Extension />
));

function Extension() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const canBlockProgress = useExtensionCapability('block_progress');

  console.log('canBlockProgress', canBlockProgress);

  const { countryCode } = useShippingAddress();

  const { lines } = useApi();

  const variants = getCartVariantIds(lines.current);

  useEffect(() => {
    async function fetchSanity() {
      return await fetchSanityVariantsByIds(
        variants?.map((variant) => `"${variant?.id}"`)
      );
    }

    if (Array.isArray(variants) && variants[0].id) {
      setError(null);
      setLoading(true);

      fetchSanity()
        .then((res) => setData(res))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [countryCode]);

  const unavailableVariants = useMemo(() => {
    if (loading) {
      return [];
    }

    const notInStockVariants = getNotInStockVariants({
      cartVariantsIds: variants?.map((variant) => variant?.id),
      sanityVariants: data,
      userCountryCode: countryCode,
    });

    return variants
      ?.filter((item) => notInStockVariants?.includes(item.id))
      ?.map((item) => `${item.title} ${item?.subtitle}`);
  }, [countryCode, loading]);

  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && unavailableVariants?.length) {
      return {
        behavior: 'block',
        reason: 'Some items are not in stock',
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === 'block') {
            console.log('Some items are not in stock');
          }
        },
      };
    }
    return {
      behavior: 'allow',
      perform: () => {
        // Ensure any errors are hidden
        console.log('Success! All items are in stock!');
      },
    };
  });

  if (loading) {
    return <SkeletonImage inlineSize={'100%'} blockSize={80} />;
  }

  if (error) {
    return (
      <Banner title='Error occur' status='critical'>
        Sorry something went wrong
      </Banner>
    );
  }

  const isPlural = () => {
    if (unavailableVariants?.length === 1) {
      return false;
    }

    return true;
  };

  return (
    <>
      {unavailableVariants?.length > 0 ? (
        <Banner title='Please note!' status='critical'>
          Next item{isPlural() ? 's' : ''} in your cart{' '}
          {isPlural() ? 'are' : 'is'} out of stock:{' '}
          {unavailableVariants?.join(', ')}
        </Banner>
      ) : (
        <Banner title='Success!' status='success'>
          All items are available in your location
        </Banner>
      )}
    </>
  );
}
