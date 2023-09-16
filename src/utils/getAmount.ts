import { ProductDocument } from "../model/product.model";

export type GetAmountCart = {
  product: ProductDocument;
  variant: string[];
  quantity: number;
};

export const getAmounts = (cart: GetAmountCart[]) => {
  const totalArray: number[] = [];
  const discountArray: number[] = [];
  const gstArray: number[] = [];

  cart.map((cartItem) => {
    const combination =
      cartItem.product.varients.variations.find(
        (variation) =>
          JSON.stringify(variation.combinationString) ===
          JSON.stringify(cartItem.variant)
      ) || cartItem.product.varients.variations[0];
    totalArray.push(combination.price * cartItem.quantity);
    discountArray.push(
      ((combination.discount * combination.price) / 100) * cartItem.quantity
    );
    gstArray.push(
      ((cartItem.product.gst_percent *
        (combination.price -
          (combination.discount * combination.price) / 100)) /
        100) *
        cartItem.quantity
    );
  });

  const total = totalArray.reduce((total, currentVal) => total + currentVal, 0);
  const discount = discountArray.reduce(
    (total, currentVal) => total + currentVal,
    0
  );
  const gst = gstArray.reduce((total, currentVal) => total + currentVal, 0);

  const finalValue = total - discount + gst;

  return { total, discount, gst, finalValue };
};
