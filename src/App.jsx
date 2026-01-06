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


// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/CartPage"));
const Wishlist = lazy(() => import("./pages/WhislistPage"));
const Shipping = lazy(() => import("./pages/ShippingPage"));
const Payment = lazy(() => import("./pages/PaymentPage"));

const Confirmation = lazy(() => import("./pages/ConfirmationPage"));
const Profile = lazy(() => import("./pages/Profile/ProfilePage2"));
const About = lazy(() => import("./pages/AboutPage"));
const Contact = lazy(() => import("./pages/ContactPage"));

// Admin
const AdminLogin = lazy(() => import("./Component/Admin/LoginAdmin"));
const AdminDashboard = lazy(() => import("./Component/Admin/AdminDashboard"));
const OrderAdmin = lazy(() => import("./Component/Admin/OrderAdmin"));
const ProductAdmin = lazy(() => import("./Component/Admin/ProductAdmin"));
const NewProduct = lazy(() => import("./Component/Admin/NewProduct"));
const ViewUsers = lazy(() => import("./Component/Admin/ViewUsers"));

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

               
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cartpage" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/orders" element={<OrderDetails/>}/>
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/profile" element={<ProfilePage2 />} />
                  </Route>

                  </Route>
                  <Route path="/login" element={<Login />} />

                  {/* 👤 USER PROTECTED ROUTES */}

                  {/* 🔐 ADMIN ROUTES */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route element={<ProtectedRoute roles={["admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/orderadmin" element={<OrderAdmin />} />
                    <Route path="/admin/productadmin" element={<ProductAdmin />} />
                    <Route path="/admin/newproductadmin" element={<NewProduct />} />
                    <Route path="/admin/users" element={<ViewUsers />} />
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
