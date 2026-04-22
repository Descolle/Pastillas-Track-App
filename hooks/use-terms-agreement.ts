import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TERMS_AGREEMENT_KEY = "terms_agreed";

export const useTermsAgreement = () => {
  const [termsChecked, setTermsChecked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTermsAgreement();
  }, []);

  const checkTermsAgreement = async () => {
    try {
      const hasAgreed = await AsyncStorage.getItem(TERMS_AGREEMENT_KEY);
      setTermsChecked(hasAgreed === "true");
    } catch (error) {
      console.error("Error checking terms agreement:", error);
      setTermsChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const acceptTerms = async () => {
    try {
      await AsyncStorage.setItem(TERMS_AGREEMENT_KEY, "true");
      setTermsChecked(true);
      return true;
    } catch (error) {
      console.error("Error accepting terms:", error);
      return false;
    }
  };

  return {
    termsChecked,
    loading,
    checkTermsAgreement,
    acceptTerms,
  };
};
