import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard"; 
import { allProductsData } from "../../pages/User/Allproducts";
import "../../assets/styles/productCard.css";

const RecentProduct = () => {  
  const navigate = useNavigate();

  // Reverse mapping to fetch the latest 6 products safely
  const recentProducts = allProductsData 
    ? [...allProductsData].reverse().slice(0, 6) 
    : [];  

  // ─── FIXED: REDIRECTS RECENT PRODUCTS CLICKS STRAIGHT TO PRODUCT DETAILS PAGE ───
  const handleRecentProductClick = (productItem) => {
    // Normalizes default configuration parameters matching baseline styles
    navigate("/product", {
      state: { product: productItem }
    });
  };

  return (
    <section className="recent-products-section my-5 w-100">
      <div className="container text-center mb-4">
        <h2 className="fw-bold text-uppercase" style={{ letterSpacing: "1px", color: "#111827" }}>
          YOU MAY ALSO LIKE PRODUCTS
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "0.95rem" }}>
          Premium Leather Furniture Crafted For Comfort, Durability, And Timeless Style 
          Designed To Elevate Every Space.
        </p>
      </div>

      <div className="recent-products-scroll-container">
        {/* FIXED: Binds custom trigger onBuyNowClick directly into child mapping framework */}
        <ProductCard 
          products={recentProducts} 
          onBuyNowClick={handleRecentProductClick} 
        />
      </div>
    </section>
  );
};

export default RecentProduct;