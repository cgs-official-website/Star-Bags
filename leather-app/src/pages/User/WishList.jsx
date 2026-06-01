import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import "../../assets/styles/WishList.css";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import { FaHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";

// ─── Single Wishlist Card ─────────────────────────────────────────────────────
function WishlistCard({ item, onRemove, onAddToCart }) {
  return (
    <div className="wl-card">
      <button
        className="wl-heart-btn"
        onClick={() => onRemove(item.id)}
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
          <button className="wl-buy-btn">Buy now</button>
          <button 
            className="wl-cart-btn" 
            aria-label="Add to cart"
            onClick={() => onAddToCart(item)}
          >
            <MdOutlineShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Wishlist State (Fixed Image & Navigation) ──────────────────────────
function EmptyWishlist() {
  const navigate = useNavigate();

  // Dynamic asset resolver to handle relative folder paths safely across routes
  const getEmptyStateImage = () => {
    return new URL("../../assets/images/empty.png", import.meta.url).href;
  };

  return (
    <div className="wl-empty-container">
      <div className="wl-empty-image-wrapper">
        <img 
          src={getEmptyStateImage()} 
          alt="Empty Bag Vector" 
          className="wl-empty-vector" 
          style={{width:"100%",height:"100%"}}
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
  const { wishlist, removeFromWishlist, addToCart } = useWishlist();

  return (
    <>
      <Navbar />

      <div className="container py-3 my-2">
        <h4 className="mb-3 fw-bold">Settings and Profile</h4>

        <div className="row justify-content-center">
          {/* Sidebar Area Column */}
          <div className="col-lg-4 col-md-5 mb-3 d-none d-lg-block">
            <ProfileSideNav />
          </div>

          {/* Main Content Area */}
          <div className="col-lg-8 col-md-7">
            <div className="profile-details-card">
              <div className="wishlist-header">
                <h4 className="fw-bold mb-1">My Wishlist</h4>
                <p className="wishlist-subtitle">Your favorite products saved here</p>
              </div>

              {/* Wishlist Content */}
              {wishlist.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div className="wl-grid">
                  {wishlist.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={removeFromWishlist}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WishList;



// import { useNavigate } from "react-router-dom"; // ← ADDED for robust routing
// import { useWishlist } from "../../context/WishlistContext";
// import "../../assets/styles/WishList.css";
// import Navbar from "../../components/User/Navbar";
// import Footer from "../../components/User/Footer";
// import ProfileSideNav from "../../components/User/Profile-Side-Nav";
// import { FaHeart, FaStar } from "react-icons/fa";
// import { MdOutlineShoppingCart } from "react-icons/md";

// // ─── Single Wishlist Card ─────────────────────────────────────────────────────
// function WishlistCard({ item, onRemove, onAddToCart }) {
//   return (
//     <div className="wl-card">
//       <button
//         className="wl-heart-btn"
//         onClick={() => onRemove(item.id)}
//         aria-label="Remove from wishlist"
//       >
//         <FaHeart className="wl-heart-icon" />
//       </button>

//       <div className="wl-img-wrap">
//         <img src={item.image} alt={item.name} className="wl-img" />
//       </div>

//       <div className="wl-card-body">
//         <div className="wl-title-row">
//           <h6 className="wl-name">{item.name}</h6>
//           <span className="wl-rating">
//             <FaStar className="wl-star" />
//             {item.rating}
//             <span className="wl-rating-count">({item.ratingCount || 0})</span>
//           </span>
//         </div>

//         <div className="wl-price-row">
//           <span className="wl-price">₹{item.price}</span>
//           <del className="wl-real-price">₹{item.realPrice}</del>
//           <span className="wl-offer">{item.offer} off</span>
//         </div>

//         <div className="wl-actions">
//           <button className="wl-buy-btn">Buy now</button>
//           <button 
//             className="wl-cart-btn" 
//             aria-label="Add to cart"
//             onClick={() => onAddToCart(item)}
//           >
//             <MdOutlineShoppingCart />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Empty Wishlist State (Fixed Image & Navigation) ──────────────────────────
// function EmptyWishlist() {
//   const navigate = useNavigate();

//   // Dynamic asset resolver to handle relative folder paths safely across routes
//   const getEmptyStateImage = () => {
//     return new URL("../../assets/images/empty.png", import.meta.url).href;
//   };

//   return (
//     <div className="wl-empty-container">
//       <div className="wl-empty-image-wrapper">
//         {/* FIX: Handled asset resolution cleanly via baseline meta URL compiler syntax */}
//         <img 
//           src={getEmptyStateImage()} 
//           alt="Empty Bag Vector" 
//           className="wl-empty-vector" 
//           style={{width:"100%",height:"100%"}}
//         />
//       </div>
//       <h3 className="wl-empty-heading">Your wishlist is empty!</h3>
      
//       {/* FIX: Switched from an <a> tag anchor to a robust navigate call path trigger */}
//       <span 
//         onClick={() => navigate("/AllProducts")} 
//         className="btn wl-empty-shop-btn"
//         style={{ cursor: "pointer" }}
//       >
//         Shop now
//       </span>
//     </div>
//   );
// }

// // ─── Main WishList Page ───────────────────────────────────────────────────────
// function WishList() {
//   const { wishlist, removeFromWishlist, addToCart } = useWishlist();

//   return (
//     <>
//       <Navbar />

//       <div className="container py-3 my-2">
//         <h4 className="mb-3 fw-bold">Wishlist</h4>

//         <div className="row align-items-start">
//           {/* Sidebar Area Column */}
//           <div className="col-lg-3 mb-3 d-none d-lg-block wl-sidebar-sticky">
//             <ProfileSideNav />
//           </div>

//           {/* Main Context Dynamic Grid Column Area */}
//           <div className="col-lg-9 col-12">
//             {wishlist.length === 0 ? (
//               <EmptyWishlist />
//             ) : (
//               <div className="wl-grid">
//                 {wishlist.map((item) => (
//                   <WishlistCard
//                     key={item.id}
//                     item={item}
//                     onRemove={removeFromWishlist}
//                     onAddToCart={addToCart}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default WishList;