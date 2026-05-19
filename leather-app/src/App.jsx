import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import WishList from './pages/WishList';
import Contact from './pages/Contact';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import ResetPassword from './pages/Resetpassword';
import ForgotPassword from './pages/ForgotPassword';
import Product from './pages/Allproducts'






import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Coupons from './pages/Admin/Coupons';
import AdminForgetPassword from './pages/Admin/ForgetPassword';
import OrderManagement from './pages/Admin/OrderManagement';
import PaymentDetails from './pages/Admin/PaymentDetails';
import ProductManagement from './pages/Admin/ProductManagement';
import AdminSettings from './pages/Admin/Settings';
import ReportAnalysis from './pages/Admin/ReportAnalysis';
import AdminResetPassword from './pages/Admin/ResetPassword';
import StoreDetails from './pages/Admin/StoreDetails';






 const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword/>} />
        <Route path="/resetPassword" element={<ResetPassword/>} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/allProduct" element={<Product />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/wishlist" element={<WishList />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/forget-password" element={<AdminForgetPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/order-management" element={<OrderManagement />} />
        <Route path="/admin/payment-details" element={<PaymentDetails />} />
        <Route path="/admin/product-management" element={<ProductManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/report-analysis" element={<ReportAnalysis />} />
        <Route path="/admin/store-details" element={<StoreDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;



// import React from 'react'


// const App = () => {
//   return (
//     <>
//     <AdminDashboard/>    
//     </>
//   )
// }
// export default App;







