import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Ajuste global para que Testing Library use data-testid
configure({
  testIdAttribute: 'data-testid',
});

// Polyfill necesario para evitar warnings con React 18+
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
