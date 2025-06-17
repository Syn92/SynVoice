import "server-only";

import en from "./dictionaries/en.json";
import fr from "./dictionaries/fr.json";

const dictionaries = {
  en: () => Promise.resolve(en),
  fr: () => Promise.resolve(fr),
};

export const getDictionary = async (locale: "en" | "fr") => {
  const dictionaryLoader = dictionaries[locale];
  if (!dictionaryLoader) {
    throw new Error(`Dictionary for locale '${locale}' not found. Available: ${Object.keys(dictionaries).join(', ')}`);
  }
  return dictionaryLoader();
}; 