import * as InAppPurchases from "expo-in-app-purchases";

const PRODUCT_ID = "plan_pro";

export const initPayments = async () => {
  await InAppPurchases.connectAsync();

  const { responseCode, results } = await InAppPurchases.getProductsAsync([
    PRODUCT_ID,
  ]);

  console.log("Productos:", results);
};

export const purchaseProduct = async (userId: string) => {
  try {
    await InAppPurchases.purchaseItemAsync(PRODUCT_ID);
  } catch (err) {
    console.log("Error compra:", err);
  }
};

export const listenPurchases = (userId: string) => {
  InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
    if (responseCode !== InAppPurchases.IAPResponseCode.OK) return;

    for (const purchase of results || []) {
      if (!purchase.acknowledged) {
        // 🔥 enviar a backend
        await fetch(
          "https://TU_PROJECT.supabase.co/functions/v1/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              purchaseToken: purchase.purchaseToken,
              productId: purchase.productId,
            }),
          },
        );

        await InAppPurchases.finishTransactionAsync(purchase, true);
      }
    }
  });
};
