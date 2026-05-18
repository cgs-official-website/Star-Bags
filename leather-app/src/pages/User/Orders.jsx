import React from "react";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/User/Footer";
import OrderCard from "../../components/User/OrderCard";
import ProfileSideNav from "../../components/User/Profile-Side-Nav";
import "../../assets/styles/Orders.css";


const Orders = () => {
  return (
    <>
    <Navbar />
    <ProfileSideNav />
      <OrderCard />
      <Footer />
    </>
  );
};

export default Orders;
