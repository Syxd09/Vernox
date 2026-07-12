import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/lib/cartContext";
import Home from "./pages/Home.tsx";
import Shop from "./pages/Shop.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import Account from "./pages/Account.tsx";
import About from "./pages/About.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="vernox-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/customize" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
