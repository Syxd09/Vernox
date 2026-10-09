import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/lib/cartContext";
import { CatalogProvider } from "@/lib/catalogContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { PageCurtain } from "@/components/experience/PageCurtain";
import { ScrollToTop } from "@/components/ScrollToTop";

// Eagerly load primary storefront landing page
import Home from "./pages/Home.tsx";

// Code-split all other pages to eliminate the 3MB initial bundle bottleneck
const Shop = lazy(() => import("./pages/Shop.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Index = lazy(() => import("./pages/Index.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Notebook = lazy(() => import("./pages/Notebook.tsx"));
const Legal = lazy(() => import("./pages/Legal.tsx"));
const Trade = lazy(() => import("./pages/Trade.tsx"));
const Shipping = lazy(() => import("./pages/Shipping.tsx"));
const Returns = lazy(() => import("./pages/Returns.tsx"));
const Faqs = lazy(() => import("./pages/Faqs.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

// Luxury subtle loading placeholder
const PageFallback = () => (
  <div className="min-h-[70vh] bg-cream flex items-center justify-center">
    <div className="text-center space-y-3">
      <span className="font-brand text-2xl text-dark-brown tracking-[0.3em] font-semibold uppercase">VERNOX</span>
      <div className="w-8 h-0.5 bg-gold mx-auto animate-pulse" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="vernox-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CatalogProvider>
          <CartProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {/* Universal Scroll Reset on Every Navigation */}
              <ScrollToTop />
              {/* Professional Luxury Curtain Transition for First Load, Reload & Navigation */}
              <PageCurtain />
              <CartDrawer />
              <Suspense fallback={<PageFallback />}>
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
                  <Route path="/trade" element={<Trade />} />
                  <Route path="/b2b" element={<Trade />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/faqs" element={<Faqs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/customize" element={<Index />} />
                  <Route path="/studio" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/notebook" element={<Notebook />} />
                  <Route path="/privacy" element={<Legal defaultTab="privacy" />} />
                  <Route path="/terms" element={<Legal defaultTab="terms" />} />
                  <Route path="/shipping-returns" element={<Shipping />} />
                  <Route path="/legal" element={<Legal defaultTab="privacy" />} />
                  {/* CATCH-ALL 404 ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </CatalogProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
