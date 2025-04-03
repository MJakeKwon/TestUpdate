module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",  // Vue 3 기본 ESLint 설정
    "eslint:recommended",         // 권장 ESLint 규칙 사용
    "prettier"                     // Prettier 설정 적용 (Prettier와 충돌 방지)
  ],
  parserOptions: {
    parser: "@babel/eslint-parser", // Babel 파서 사용
    requireConfigFile: false,        // Babel 설정 파일 요구 방지
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
