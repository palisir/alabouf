import type { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
  locales: ["fr", "en"],
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

