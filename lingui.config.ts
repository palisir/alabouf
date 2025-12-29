import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["fr", "en", "es", "pt", "zh", "de", "ja"],
  sourceLocale: "fr",
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["app"],
    },
  ],
  compileNamespace: "ts",
  extractorParserOptions: {
    tsExperimentalDecorators: false,
    flow: false,
  },
};

export default config;

