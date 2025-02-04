import { useTranslation } from "react-i18next";

export function useTranslationPath(keyPrefix: string) {
  return useTranslation("translation", {
    keyPrefix,
  });
}