import React from "react";
import ProductCard from "./ProductCard"; 
import { allProductsData } from "../../pages/User/Allproducts";
import "../../assets/styles/productCard.css";

const RecentProduct = () => {  
  const recentProducts = allProductsData 
    ? [...allProductsData].reverse().slice(0, 6) 
    : [];  

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
        <ProductCard products={recentProducts} />
      </div>
    </section>
  );
};

export default RecentProduct;