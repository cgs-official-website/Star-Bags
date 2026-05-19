import React from 'react';
import Navbar from '../components/User/Navbar';
import Footer from '../components/User/Footer';
import 
function WishList() {
  return (
    <div>
      <Navbar />
      <div className="wishlist-container">
        <h2>My Wishlist</h2>
        <p>Your favorite items will appear here.</p>
      </div>
      <Footer />
    </div>
  )
}

export default WishList