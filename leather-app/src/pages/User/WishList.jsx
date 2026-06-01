import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductsContext";
import "../../assets/styles/WishList.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { FaHeart, FaStar, FaCheck } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { WishlistSkeleton } from "../../components/User/UserSkeleton";

// ─── Single Wishlist Card ─────────────────────────────────────────────────────
function WishlistCard({ item, isInCart, onRemove, onAddToCart, onRemoveFromCart, onNavigate }) {
  return (
    <div
      className="wl-card"
      onClick={() => onNavigate(item)}
      style={{ cursor: "pointer" }}
    >
      {/* Heart remove button — stopPropagation so it doesn't trigger card navigation */}
      <button
        className="wl-heart-btn"
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        aria-label="Remove from wishlist"
      >
        <FaHeart className="wl-heart-icon" />
      </button>

      <div className="wl-img-wrap">
        <img src={item.image} alt={item.name} className="wl-img" />
      </div>

      <div className="wl-card-body">
        <div className="wl-title-row">
          <h6 className="wl-name">{item.name}</h6>
          <span className="wl-rating">
            <FaStar className="wl-star" />
            {item.rating}
            <span className="wl-rating-count">({item.ratingCount || 0})</span>
          </span>
        </div>

        <div className="wl-price-row">
          <span className="wl-price">₹{item.price}</span>
          <del className="wl-real-price">₹{item.realPrice}</del>
          <span className="wl-offer">{item.offer} off</span>
        </div>

        <div className="wl-actions">
          {/* Buy now → navigate to product details */}
          <button
            className="wl-buy-btn"
            onClick={(e) => { e.stopPropagation(); onNavigate(item); }}
          >
            Buy now
          </button>

          {/* Add/Remove to/from cart — stopPropagation so it doesn't trigger card navigation */}
          <button
            className={`wl-cart-btn ${isInCart ? "in-cart" : ""}`}
            aria-label={isInCart ? "Remove from cart" : "Add to cart"}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isInCart) {
                onRemoveFromCart();
              } else {
                onAddToCart(item); 
              }
            }}
            style={isInCart ? { background: '#22c55e', color: '#fff', borderColor: '#22c55e', cursor: 'pointer' } : {}}
          >
            {isInCart ? <FaCheck /> : <MdOutlineShoppingCart />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Wishlist State ─────────────────────────────────────────────────────
function EmptyWishlist() {
  const navigate = useNavigate();

  const getEmptyStateImage = () =>
    new URL("../../assets/images/empty.png", import.meta.url).href;

  return (
    <div className="wl-empty-container">
      <div className="wl-empty-image-wrapper">
        <img
          src={getEmptyStateImage()}
          alt="Empty Bag Vector"
          className="wl-empty-vector"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <h3 className="wl-empty-heading">Your wishlist is empty!</h3>
      <span
        onClick={() => navigate("/AllProducts")}
        className="btn wl-empty-shop-btn"
        style={{ cursor: "pointer" }}
      >
        Shop now
      </span>
    </div>
  );
}

// ─── Main WishList Page ───────────────────────────────────────────────────────
function WishList() {
  const navigate = useNavigate();
  const { wishlist, wishlistLoading, removeFromWishlist, addToCart, removeFromCart, cart } = useWishlist();
  const { products } = useProducts();

  // Merge live product data for accurate rating + pass full product to ProductDetails
  const liveWishlist = wishlist.map((item) => {
    const liveProduct = products.find(
      (p) => p.id === item.id || p.productId === item.productId || p.name === item.name
    );
    if (liveProduct) {
      return {
        ...liveProduct,  // full product fields for ProductDetails
        ...item,         // wishlist overrides (id, image, offer, etc.)
        rating: liveProduct.rating,
        ratingCount: liveProduct.reviewCount || 0,
      };
    }
    return item;
  });

  const handleNavigateToProduct = (item) => {
    navigate("/product", { state: { product: item } });
  };

  return (
    <>
      <Navbar />

      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Wishlist</h4>

        <div className="row justify-content-center align-items-start">
          {/* Sidebar */}
          <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block wl-sidebar-sticky">
            <ProfileSideNav />
          </div>

          {/* Main Grid */}
          <div className="col-lg-8 col-md-7 col-12">
            {wishlistLoading ? (
              <WishlistSkeleton />
            ) : liveWishlist.length === 0 ? (
              <EmptyWishlist />
            ) : (
              <div className="wl-grid">
                 {liveWishlist.map((item) => {
                  const cartItem = cart.find((cartItem) => cartItem.name === item.name);
                  const isInCart = !!cartItem;
                  return (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      isInCart={isInCart}
                      onRemove={removeFromWishlist}
                      onAddToCart={addToCart}
                      onRemoveFromCart={() => {
                        if (cartItem) {
                          removeFromCart(cartItem.id);
                        }
                      }}
                      onNavigate={handleNavigateToProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WishList;