import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { CompareProvider } from './context/CompareContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { OfflineProvider } from './context/OfflineContext';

import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import CapacitorBridge from './components/CapacitorBridge';
import AuthGate from './components/AuthGate';

// Luxury Code-Splitting with React.lazy for high performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SellerRegisterPage = lazy(() => import('./pages/SellerRegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const WardrobeBuilderPage = lazy(() => import('./pages/WardrobeBuilderPage'));
const SocietyPage = lazy(() => import('./pages/SocietyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductEditPage = lazy(() => import('./pages/AdminProductEditPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminSupportQueuePage = lazy(() => import('./pages/AdminSupportQueuePage'));

const SellerDashboardPage = lazy(() => import('./pages/SellerDashboardPage'));
const SellerProductsPage = lazy(() => import('./pages/SellerProductsPage'));
const SellerOrdersPage = lazy(() => import('./pages/SellerOrdersPage'));

function LuxuryPageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF9F5] dark:bg-[#0B0B0E] transition-colors duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating gold aura ring */}
        <div className="w-16 h-16 rounded-full border border-[#C2A676]/30 animate-ping absolute" />
        {/* Spinning luxury hairline ring */}
        <div className="w-12 h-12 rounded-full border-t-2 border-r border-[#C2A676] animate-spin" />
        {/* Brand Monogram */}
        <span className="absolute font-serif text-sm font-semibold tracking-widest text-[#141414] dark:text-[#E2DFD7]">
          É
        </span>
      </div>
      <p className="mt-5 text-[11px] font-mono tracking-[0.25em] uppercase text-[#737373] dark:text-[#A3A3A3] animate-pulse">
        Curating Atelier Experience...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <OfflineProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <ToastProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                  <LoyaltyProvider>
                    <CompareProvider>
                      <BrowserRouter>
                        <CapacitorBridge />
                        <Suspense fallback={<LuxuryPageLoader />}>
                          <Routes>
                            {/* Unauthenticated Authentication Routes (Open to all) */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/seller/register" element={<SellerRegisterPage />} />
                            <Route path="/become-seller" element={<SellerRegisterPage />} />

                            {/* Public & Customer Shopping Routes — Gated: User must log in first */}
                            <Route
                              path="/"
                              element={
                                <AuthGate>
                                  <RootLayout />
                                </AuthGate>
                              }
                            >
                              <Route index element={<HomePage />} />
                              <Route path="shop" element={<ShopPage />} />
                              <Route path="product/:slug" element={<ProductDetailPage />} />
                              <Route path="collections" element={<CollectionsPage />} />
                              <Route path="about" element={<AboutPage />} />
                              <Route path="cart" element={<CartPage />} />
                              <Route path="checkout" element={<CheckoutPage />} />
                              <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
                              <Route path="wishlist" element={<WishlistPage />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route path="profile/orders" element={<OrderHistoryPage />} />
                              <Route path="profile/orders/:orderId" element={<OrderDetailPage />} />
                              <Route path="wardrobe-builder" element={<WardrobeBuilderPage />} />
                              <Route path="society" element={<SocietyPage />} />
                              <Route path="*" element={<NotFoundPage />} />
                            </Route>

                            {/* Seller / Merchant Partner Studio — Gated behind AuthGate */}
                            <Route
                              path="/seller"
                              element={
                                <AuthGate>
                                  <SellerLayout />
                                </AuthGate>
                              }
                            >
                              <Route index element={<SellerDashboardPage />} />
                              <Route path="dashboard" element={<SellerDashboardPage />} />
                              <Route path="products" element={<SellerProductsPage />} />
                              <Route path="products/new" element={<AdminProductEditPage />} />
                              <Route path="orders" element={<SellerOrdersPage />} />
                            </Route>

                            {/* Administrative Back-Office Routes — Gated behind AuthGate */}
                            <Route
                              path="/admin"
                              element={
                                <AuthGate>
                                  <AdminLayout />
                                </AuthGate>
                              }
                            >
                              <Route index element={<AdminDashboardPage />} />
                              <Route path="products" element={<AdminProductsPage />} />
                              <Route path="products/new" element={<AdminProductEditPage />} />
                              <Route path="products/:id/edit" element={<AdminProductEditPage />} />
                              <Route path="orders" element={<AdminOrdersPage />} />
                              <Route path="support" element={<AdminSupportQueuePage />} />
                              <Route path="users" element={<AdminUsersPage />} />
                            </Route>
                          </Routes>
                        </Suspense>
                      </BrowserRouter>
                    </CompareProvider>
                  </LoyaltyProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </CurrencyProvider>
      </LanguageProvider>
      </OfflineProvider>
    </ThemeProvider>
  );
}

