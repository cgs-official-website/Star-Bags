import { useWishlist } from "../../context/WishlistContext"; 
import { allProductsData } from "../../pages/User/Allproducts"; 
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import "../../assets/styles/productCard.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const WishlistHeart = ({ product }) => {
  const { wishlist, toggleWishlist } = useWishlist();

  const isWishlist = wishlist.some(
    (item) => item.name === product.name && Number(item.price) === Number(product.price)
  );

  return (
    <div className="wishlist">
      <button
        className="wishlist-toggle shadow-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Stops nested dual element triggers
          toggleWishlist(product);
        }}
        type="button"
      >
        {isWishlist ? (
          <FaHeart className="text-danger" />
        ) : (
          <FiHeart className="text-danger" />
        )}
      </button>
    </div>
  );
};

const ProductCard = ({ products = null }) => {  
  const { addToCart } = useWishlist();
  const productCard = products || allProductsData;  

  return (
    <>
      <section style={{ width: "100%" }}>
        <div className="ProductCard-section my-3">
          <div className="container d-flex gap-3 flex-wrap"> 
            {productCard.map((pro, index) => (
              <div
                className="card border-0 shadow-sm position-relative"
                key={pro.id || index}
                style={{ width: "15rem" }}
              >
                <img src={pro.image} className="card-img-top" alt={pro.name} />
                <WishlistHeart product={pro} />
                
                <div className="card-body">
                  <div className="d-flex justify-content-between pt-2">
                    <h6 className="card-title text-truncate" style={{ maxWidth: "70%" }}>
                      {pro.name}
                    </h6>
                    <span className="rating-stars d-flex align-items-center" style={{ color: "black" }}>
                      <FaStar className="me-1" style={{ color: "#fff240" }} />
                      {pro.rating || "0.0"}
                    </span>
                  </div>

                  <div className="price-details d-flex align-items-center gap-4 pt-1">
                    <p className="mb-1" style={{ color: "#1A1A1A", fontWeight: "600" }}>
                      ₹{pro.price}{" "}
                      <span>
                        <del style={{ color: "#7d7d7dff", fontWeight: "500" }}>
                          ₹{pro.realPrice}
                        </del>
                      </span>
                    </p>
                    <span className="mb-1 text-success small">
                      <b>{pro.offer} off</b>
                    </span>
                  </div>

                  <div className="d-flex gap-3 pt-2">
                    <a 
                      href="#" 
                      className="btn buy-now-btn" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); // Stops double popup fire
                        addToCart(pro); 
                      }}
                      style={{ background: "#8B5CF6", color: "#fff", fontSize: "14px" }}
                    >
                      Buy Now
                    </a>
                    <button 
                      className="icon-btn-cart" 
                      onClick={(e) => {
                        e.stopPropagation(); // Stops double popup fire
                        addToCart(pro);
                      }}
                      style={{ border: "1.5px solid #8B5CF6", color: "#8B5CF6", background: "transparent", borderRadius: "6px", padding: "4px 10px" }}
                      type="button"
                    >
                      <MdOutlineShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCard;