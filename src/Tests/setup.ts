import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Ajuste general para Testing Library (usa data-testid)
configure({
  testIdAttribute: 'data-testid',
});

// Polyfill requerido por React 18 en entornos de prueba
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
