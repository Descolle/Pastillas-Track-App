export const initPayments = async () => {
  throw new Error(
    "Payments are temporarily disabled until Google Play Billing is updated.",
  );
};

export const purchaseProduct = async (_userId: string) => {
  throw new Error(
    "Payments are temporarily disabled until Google Play Billing is updated.",
  );
};

export const listenPurchases = (_userId: string) => {
  return () => undefined;
};
