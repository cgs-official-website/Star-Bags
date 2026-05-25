// ProductCard.jsx - Just add ONE line at the top and modify ONE line
import React, { useState } from "react";

import { MdOutlineShoppingCart } from "react-icons/md";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import "../../assets/styles/productCard.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const WishlistHeart = () => {
  const [isWishlist, setIsWishlist] = useState(false);
  return (
    <div className="wishlist">
      <button
        className="wishlist-toggle shadow-sm"
        onClick={() => setIsWishlist(!isWishlist)}
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

// ONLY CHANGE HERE - Add props parameter
const ProductCard = ({ products = null }) => {  // ← ADD THIS
  // Original hardcoded data (kept as backup)
  const defaultProducts = [
    { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "160", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Slim Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "180", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Belt", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Bag", rating: 4.2, price: "100", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Leather Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
    { image: "../src/assets/images/leather1.png", name: "Wallet", rating: 4.2, price: "120", realPrice: "120", offer: "20%" },
  ];

  // Use passed products if available, otherwise use default
  const productCard = products || defaultProducts;  // ← ADD THIS

  return (
    <>
      <section>
        <div className="ProductCard-section my-3">
          <div className="container d-flex gap-3 flex-nowrap">
            {productCard.map((pro, index) => (
              <div
                className="card border-0 shadow-sm"
                key={index}
                style={{ width: "15rem" }}
              >
                <img src={pro.image} className="card-img-top" alt={pro.name} />
                <WishlistHeart />
                <div className="card-body">
                  <div className="d-flex justify-content-between pt-2">
                    <h6 className="card-title">{pro.name}</h6>
                    <span
                      className="rating-stars d-flex align-items-center"
                      style={{ color: "black" }}
                    >
                      <FaStar className="me-1" style={{ color: "#fff240" }} />
                      {pro.rating}
                    </span>
                  </div>

                  <div className="price-details d-flex align-items-center gap-5 pt-1">
                    <p className="mb-1" style={{ color: "#1A1A1A", fontWeight: "600" }}>
                      ₹{pro.price}{" "}
                      <span>
                        <del style={{ color: "#7d7d7dff", fontWeight: "500" }}>
                          ₹{pro.realPrice}
                        </del>
                      </span>
                    </p>
                    <span className="mb-1">
                      <b>{pro.offer} off</b>
                    </span>
                  </div>

                  <div className="d-flex gap-3 pt-1">
                    <a href="#" className="btn">Buy Now</a>
                    <button className="icon-btn-cart">
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

