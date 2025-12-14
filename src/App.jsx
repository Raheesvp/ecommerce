import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';
import Cart from './pages/CartPage';
import WhislistPage from './pages/WhislistPage';
import ProtectedRoute from './Component/Routes/ProtectedRoute';
import { SearchProvider } from './Context/SearchContext';
import ShippingPage from './pages/ShippingPage';
import { ToastContainer } from "react-toastify";
import ProductDetails from './pages/ProductDetails';
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from './pages/ProfilePage';
import Navbar from './Component/Navbar';
import PaymentPage from './pages/PaymentPage';
import { OrderProvider } from './Context/OrderContext';
import ConfirmationPage from './pages/ConfirmationPage';
import ContactPage from './pages/ContactPage';
import OrderDetails from './pages/OrderDetails';
import AddProduct from './Component/Admin/ProductAdmin';
import LoginAdmin from './Component/Admin/LoginAdmin';
import OrderAdmin from './Component/Admin/OrderAdmin';
import NewProduct from './Component/Admin/NewProduct';
import AboutPage from './pages/AboutPage';
import ViewUsers from './Component/Admin/ViewUsers';
import AdminDashboard from './Component/Admin/AdminDashboard';
import footballAnimation from './animation/FootballAnimation.json'
import Lottie from 'lottie-react'
import '../src/App.css'

// Football-themed loading component
const Animation = () => {
  return (
    <Lottie
      animationData={footballAnimation}
      loop={true}
      style={{ width: 200, height: 200, margin: 'auto', marginTop: '20%' }}
    />
  );
};

// Payment Blocking Component to prevent going back to payment
const PaymentBlocker = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Prevent going back to payment page after confirmation
    if (location.pathname === '/confirmation') {
      // Remove payment page from history
      window.history.replaceState(null, '', window.location.href);
    }
  }, [location]);

  return children;
};

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Paths where navbar should be hidden
  const hideNavbarPaths = [
    '/login',
    '/admin/login',
    '/admin/dashboard',
    '/admin/users',
    '/admin/orderadmin',
    '/admin/productadmin',
    '/admin/newproductadmin',
    '/404'
  ];

  // Public paths that don't require authentication
  const publicPaths = ['/', '/products', '/products/:id', '/contact', '/about'];

  if (showLoader) {
    return <Animation />;
  }

  return (
    <>
      <Suspense fallback={<Animation />}>
        <SearchProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <OrderProvider>
                  <ToastContainer position='top-right' autoClose={2000} />

                  {/* Show Navbar only if path is not in hidden list */}
                  {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

                  <PaymentBlocker>
                    <Routes>
                      {/* Public pages - accessible without login */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Product />} />
                      <Route path='/products/:id' element={<ProductDetails />} />
                      <Route path='/contact' element={<ContactPage />} />
                      <Route path='/about' element={<AboutPage />} />

                      {/* Auth routes (public) */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                      <Route path="/admin/login" element={<LoginAdmin />} />

                      {/* Admin protected routes */}
                      <Route element={<ProtectedRoute roles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/orderadmin" element={<OrderAdmin />} />
                        <Route path="/admin/productadmin" element={<AddProduct />} />
                        <Route path="/admin/newproductadmin" element={<NewProduct />} />
                        <Route path="/admin/users" element={<ViewUsers />} />
                      </Route>

                      {/* User protected routes - require authentication */}
                      <Route element={<ProtectedRoute requireAuth={true} />}>
                        <Route path='/cartpage' element={<Cart />} />
                        <Route path='/wishlist' element={<WhislistPage />} />
                        <Route path='/shipping' element={<ShippingPage />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/payment' element={<PaymentPage />} />
                        <Route path='/order' element={<OrderDetails />} />
                      </Route>

                      {/* Confirmation route - special handling to prevent back navigation */}
                      <Route element={<ProtectedRoute requireAuth={true} />}>
                        <Route path='/confirmation' element={<ConfirmationPage />} />
                      </Route>

                      {/* 404 page */}
                      <Route path="/404" element={<h1 className="text-white text-center mt-20 text-2xl">404 Page Not Found</h1>} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </PaymentBlocker>
                </OrderProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </SearchProvider>
      </Suspense>
    </>
  );
}

// Lazy loaded components
const Product = lazy(() => import("./pages/Product"));

export default App;