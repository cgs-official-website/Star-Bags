import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import WishList from './pages/WishList';
import Contact from './pages/Contact';
import CreateAccount from './pages/CreateAccount';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<CreateAccount />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/allProduct" element={<Product />} /> */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<WishList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;