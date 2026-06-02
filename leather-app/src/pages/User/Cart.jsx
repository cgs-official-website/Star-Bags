import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { cart, setCart, toggleWishlist, removeFromCart, updateCartQty, toggleCartSelect } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Core calculations engine matching your transaction ledger guidelines
  const selectedItems = cart ? cart.filter((item) => item.selected) : [];
  const totalItemsCount = selectedItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  // Raw Total calculation using top-grain baseline parameters (Strict INR Currency ₹)
  const rawTotal = selectedItems.reduce((acc, item) => {
    const originalPrice = Number(item.realPrice) || Number(item.price) || 0;
    return acc + (originalPrice * (item.qty || 1));
  }, 0);
  
  // Checkout Subtotal after target wholesale item discount matrices
  const subTotal = selectedItems.reduce((acc, item) => {
    return acc + (Number(item.price) * (item.qty || 1));
  }, 0);

  const discountTotal = rawTotal > subTotal ? (rawTotal - subTotal) : 0;
  const gstTotal = Math.round(subTotal * 0.18);
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

        {/* ─── CONDITIONAL LAYOUT SPLIT MATRIX ─── */}
        {!cart || cart.length === 0 ? (
          <>
            {/* Display clean empty graphics if ledger holds zero entries */}
            <EmptyCartView />
            
            {/* Recommendation products strip grid panel banner link layout */}
            <RecentProduct />
          </>
        ) : (
          <div className="cart-layout-grid">
            {/* Left Block: Render list elements with dynamic custom triggers */}
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
            
            {/* Right Block: Order Total Calculation Summary column layout box panel */}
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