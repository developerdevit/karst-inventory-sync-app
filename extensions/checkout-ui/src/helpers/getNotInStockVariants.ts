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
      const stock = searchedItem?.locations.find((stockItem) =>
        stockItem.stockCoverage.includes(userCountryCode)
      );

      if (stock && stock?.quantity > 0) {
        return false;
      } else {
        return true;
      }
    }

    return true;
  });
}
