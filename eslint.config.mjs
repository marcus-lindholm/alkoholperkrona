import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'android/**',
      'ios/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Reading localStorage/matchMedia into state after mount is the
      // hydration-safe way to load client-only preferences (dark mode etc.);
      // a lazy useState initializer would cause an SSR hydration mismatch.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
