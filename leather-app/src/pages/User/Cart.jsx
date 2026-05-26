import { useNavigate } from "react-router-dom";
// FIX: Imports directly from WishlistContext, matching your single-file structure
import { useWishlist } from "../../context/WishlistContext"; 
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import RecentProduct from "../../components/User/RecentProduct"; 
import "../../assets/styles/Cart.css";

const EmptyCartView = () => {
  const navigate = useNavigate();
  return (
    <div className="wl-empty-container my-4">
      <div className="wl-empty-image-wrapper">
        <img 
          src={new URL("../../assets/images/empty.png", import.meta.url).href} 
          alt="Empty Cart Vector" 
          className="wl-empty-vector" 
        />
      </div>
      <h3 className="wl-empty-heading">Your cart is empty!</h3>
      <button 
        onClick={() => navigate("/AllProducts")} 
        className="btn wl-empty-shop-btn" 
        style={{ cursor: "pointer", border: "none" }}
      >
        Shop now
      </button>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, toggleWishlist, removeFromCart, updateCartQty, toggleCartSelect } = useWishlist();

  // Core calculations engine matching your updated schemas
  const selectedItems = cart ? cart.filter((item) => item.selected) : [];
  const totalItemsCount = selectedItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  // Raw Total calculation using original realPrice
  const rawTotal = selectedItems.reduce((acc, item) => {
    const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
    return acc + (originalPrice * (item.qty || 1));
  }, 0);
  
  // Checkout Total after item discount offers
  const subTotal = selectedItems.reduce((acc, item) => {
    return acc + (Number(item.price) * (item.qty || 1));
  }, 0);

  const discountTotal = rawTotal > subTotal ? (rawTotal - subTotal) : 0;
  const gstTotal = Math.round(subTotal * 0.05);
  const finalTotal = subTotal + gstTotal;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed.");
      return;
    }
    navigate("/checkout", {
      state: {
        allCartItems: cart,
        cartItems: selectedItems,
        totalItemsCount,
        rawTotal,
        discountTotal,
        subTotal,
        gstTotal,
        finalTotal,
        couponDiscount: 0,
        couponPercentageLabel: ""
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <h4 className="cart-title">
          Your cart <span className="cart-count">({cart?.length || 0} items)</span>
        </h4>
        <p className="cart-subtitle">Review your items and proceed to checkout</p>

        {/* ─── CONDITIONAL LAYOUT SPLIT ─── */}
        {!cart || cart.length === 0 ? (
          <>
            {/* Display empty cart status graphics */}
            <EmptyCartView />
            
            {/* Display the 6 recommendations products strip panel */}
            <RecentProduct />
          </>
        ) : (
          /* Displays the checkout calculation columns when active items are present */
          <div className="cart-layout-grid">
            <div className="cart-left">
              <div className="cart-items">
                {cart.map((item, index) => (
                  <CartItem 
                    key={item.id || `${item.name}-${index}`} 
                    item={item} 
                    onIncrease={(id) => updateCartQty(id, 1)} 
                    onDecrease={(id) => updateCartQty(id, -1)} 
                    onRemove={(id) => removeFromCart(id)} 
                    onToggleWishlist={(product) => toggleWishlist(product)} 
                    onSelect={(id) => toggleCartSelect(id)} 
                  />
                ))}
              </div>
            </div>
            
            <div className="cart-right">
              <OrderSummary 
                totalItemsCount={totalItemsCount} 
                rawTotal={rawTotal} 
                discountTotal={discountTotal} 
                subTotal={subTotal} 
                couponDiscount={0} 
                gstTotal={gstTotal} 
                finalTotal={finalTotal} 
                handleCheckout={handleCheckout} 
                isBillingPage={false} 
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;