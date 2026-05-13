import { BrowserRouter,Routes,Route } from 'react-router-dom';

import { Home } from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import WishList from './pages/WishList';



import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Coupons from './pages/Admin/Coupons';
import ForgetPassword from './pages/Admin/ForgetPassword';
import OrderManagement from './pages/Admin/OrderManagement';
import PaymentDetails from './pages/Admin/PaymentDetails';
import ProductManagement from './pages/Admin/ProductManagement';
import Settings from './pages/Admin/Settings';
import ReportAnalysis from './pages/Admin/ReportAnalysis';
import ResetPassword from './pages/Admin/ResetPassword';
import StoreDetails from './pages/Admin/StoreDetails';



const App = () => {
  return (
    <BrowserRouter>
        <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/wishlist" element={<WishList />} />



      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/forget-password" element={<ForgetPassword />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/coupons" element={<Coupons />} />
      <Route path="/admin/order-management" element={<OrderManagement />} />
      <Route path="/admin/payment-details" element={<PaymentDetails />} />
      <Route path="/admin/product-management" element={<ProductManagement />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/report-analysis" element={<ReportAnalysis />} />
      <Route path="/admin/store-details" element={<StoreDetails />} />


    </Routes>
    </BrowserRouter>
  );
};

export default App;
