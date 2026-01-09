import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import { SearchProvider } from "./Context/SearchContext";
import { OrderProvider } from "./Context/OrderContext";
import ProtectedRoute from "./Component/Routes/ProtectedRoute";
import Navbar from "./Component/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./pages/MainLayout";
import ProfilePage2 from "./pages/Profile/ProfilePage2";
import OrderDetails from "./pages/Profile/Sections/ProfileOrderDetails";
import ConfirmationPage from "./pages/ConfirmationPage";
import ViewProducts from "./Component/Admin2/ViewProducts";
import ViewOrders from "./Component/Admin2/ViewOrders";
import AddProduct from "./Component/Admin2/AddProduct";
import EditProduct from "./Component/Admin2/EditProduct";
import AdminLayout from "./Component/Admin2/AdminLayout";
import AdminDashboard from "./Component/Admin2/AdminDashboard";
import ViewUsers from "./Component/Admin2/ViewUsers";
import ResetPasswordPage from "./pages/ResetPassword";


// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/CartPage"));
const Wishlist = lazy(() => import("./pages/WhislistPage"));
const Shipping = lazy(() => import("./pages/ShippingPage"));
const Payment = lazy(() => import("./pages/PaymentPage"));

// const Confirmation = lazy(() => import("./pages/ConfirmationPage"));
const Profile = lazy(() => import("./pages/Profile/ProfilePage2"));
const About = lazy(() => import("./pages/AboutPage"));
const Contact = lazy(() => import("./pages/ContactPage"));

// Admin



function App() {
  const location = useLocation();



    return (
     
  
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <SearchProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <ToastContainer theme="dark"  autoClose={2000}/>
<Routes>
                {/* {!hideNavbar && <Navbar />} */}
        <Route element={<MainLayout/>}>
          
            <Route path="/" element={<Home />} />
  
                  <Route path="/products" element={<Product />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reset-password" element={<ResetPasswordPage/>}/>

      
               
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cartpage" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/orders" element={<OrderDetails/>}/>
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/profile" element={<ProfilePage2 />} />
                  </Route>

                  </Route>
                  <Route path="/login" element={<Login />} />

                  {/* 👤 USER PROTECTED ROUTES */}

                  {/* 🔐 ADMIN ROUTES */}
             <Route element={<ProtectedRoute roles={["admin"]} />}>
  <Route path="/admin" element={<AdminLayout />}>
    {/* Use relative paths (no leading slash) */}
    <Route index element={<Navigate to="Dashboard" replace />} />
    <Route path="Dashboard" element={<AdminDashboard />} />
    <Route path="ViewUsers" element={<ViewUsers />} />
    <Route path="ViewProducts" element={<ViewProducts />} />
    <Route path="ViewOrders" element={<ViewOrders />} />
    <Route path="AddProduct" element={<AddProduct />} />
    <Route path="EditProduct/:id" element={<EditProduct />} />
    <Route path="OrderDetails/:id" element={<OrderDetails />} />
  </Route>
</Route>


                  {/* ❌ 404 */}
                  <Route
                    path="/404"
                    element={
                      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                        404 Page Not Found
                      </div>
                    }
                  />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </SearchProvider>
    </Suspense>
  );
}

export default App;
