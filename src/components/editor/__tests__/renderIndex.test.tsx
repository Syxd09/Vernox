import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/lib/cartContext';
import { CatalogProvider } from '@/lib/catalogContext';
import Index from '@/pages/Index';

const queryClient = new QueryClient();

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Index / CAD Studio component', () => {
  it('renders Index without crashing', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CatalogProvider>
          <CartProvider>
            <BrowserRouter>
              <Index />
            </BrowserRouter>
          </CartProvider>
        </CatalogProvider>
      </QueryClientProvider>
    );
    expect(container).toBeDefined();
  });
});
