import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import CartItem from "../../components/User/YourCart";
import OrderSummary from "../../components/User/OrderSummary";
import "../../assets/styles/cart.css";

const EmptyCartView = () => {
  const navigate = useNavigate();
  return (
    <div className="wl-empty-container my-4">
      <div className="wl-empty-image-wrapper">
        <img src={new URL("../../assets/images/empty.png", import.meta.url).href} alt="Empty Cart Vector" className="wl-empty-vector" />
      </div>
      <h3 className="wl-empty-heading">Your cart is empty!</h3>
      <button onClick={() => navigate("/AllProducts")} className="btn wl-empty-shop-btn" style={{ cursor: "pointer", border: "none" }}>
        Shop now
      </button>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, toggleWishlist, removeFromCart, updateCartQty, toggleCartSelect } = useWishlist();

  const selectedItems = cart ? cart.filter((item) => item.selected) : [];
  const totalItemsCount = selectedItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const rawTotal = selectedItems.reduce((acc, item) => {
    const oldPriceNum = Number(item.realPrice) || Number(item.price);
    return acc + oldPriceNum * (item.qty || 1);
  }, 0);
  
  const subTotal = selectedItems.reduce((acc, item) => acc + Number(item.price) * (item.qty || 1), 0);
  const discountTotal = rawTotal - subTotal;
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
        <h4 className="cart-title">Your cart <span className="cart-count">({cart?.length || 0} items)</span></h4>
        <p className="cart-subtitle">Review your items and proceed to checkout</p>

        {!cart || cart.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className="cart-layout-grid">
            <div className="cart-left">
              <div className="cart-items">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id} 
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