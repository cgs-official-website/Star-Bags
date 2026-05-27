// ProductCard.jsx - Just add ONE line at the top and modify ONE line
import React, { useState } from "react";

import { useNavigate } from "react-router-dom"; 
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
          e.stopPropagation();
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
  const navigate = useNavigate(); 
  const { cart, addToCart } = useWishlist();
  const productCard = products || allProductsData;  

  const checkIsInCart = (product) => {
    return cart ? cart.find((item) => item.name === product.name && Number(item.price) === Number(product.price)) : null;
  };

  const handleBuyNowRedirect = (pro) => {
    const existingCartItem = checkIsInCart(pro);
    
    let targetItems = [];
    if (existingCartItem) {
      targetItems = [{ ...existingCartItem, selected: true }];
    } else {
      addToCart(pro);
      targetItems = [{ ...pro, qty: 1, selected: true }];
    }

    const totalItemsCount = targetItems.reduce((acc, item) => acc + (item.qty || 1), 0);
    const rawTotal = targetItems.reduce((acc, item) => (acc + (Number(item.realPrice || item.price) * (item.qty || 1))), 0);
    const subTotal = targetItems.reduce((acc, item) => (acc + (Number(item.price) * (item.qty || 1))), 0);
    const discountTotal = rawTotal > subTotal ? (rawTotal - subTotal) : 0;
    const gstTotal = Math.round(subTotal * 0.05);
    const finalTotal = subTotal + gstTotal;

    navigate("/checkout", {
      state: {
        allCartItems: cart || [],
        cartItems: targetItems,
        totalItemsCount,
        rawTotal,
        discountTotal,
        subTotal,
        gstTotal,
        finalTotal,
        couponDiscount: 0,
        couponPercentageLabel: ""
      }
    });
  };

  return (
    <>
      <section style={{ width: "100%" }}>
        <div className="ProductCard-section my-3">
          <div className="container d-flex gap-3 flex-wrap justify-content-start"> 
            {productCard.map((pro, index) => {
              const matchedCartItem = checkIsInCart(pro);
              const isInCart = !!matchedCartItem;

              return (
                <div
                  className="card border-0 shadow-sm position-relative"
                  key={pro.id || index}
                  style={{ width: "15rem", flex: "0 0 auto" }}
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

                    {/* Buttons removed */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCard;
