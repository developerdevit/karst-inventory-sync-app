import { CartLine } from '@shopify/ui-extensions/checkout';

export function getCartVariantIds(cartLine: CartLine[]) {
  const variants = cartLine?.map((item) => ({
    id: item?.merchandise?.id,
    title: item?.merchandise?.title,
    subtitle: item?.merchandise?.subtitle,
    quantity: item?.quantity,
  }));

  return variants;
}
