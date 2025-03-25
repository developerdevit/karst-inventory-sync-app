import { TSanityVariant } from '../types';

interface IProps {
  cartVariantsIds: string[];
  sanityVariants: TSanityVariant[];
  userCountryCode: string;
}

export function getNotInStockVariants({
  cartVariantsIds,
  sanityVariants,
  userCountryCode,
}: IProps) {
  return cartVariantsIds.filter((cartVariant) => {
    const searchedItem = sanityVariants.find(
      (item) => item?.store?.gid === cartVariant
    );

    if (searchedItem) {
      const stocksQuantity = searchedItem?.locations?.reduce(
        (acc: number, location) => {
          if (
            location?.stockCoverage?.includes(userCountryCode) &&
            location?.quantity > 0
          ) {
            acc += location?.quantity;
          }

          return acc;
        },
        0
      );

      console.log('stocksQuantity', stocksQuantity);

      if (stocksQuantity > 0) {
        return false;
      } else {
        return true;
      }
    }

    return true;
  });
}
