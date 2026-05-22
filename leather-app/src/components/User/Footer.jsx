import "../../assets/styles/Footer.css";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  
  // Safe URL-encoded dynamic link targeted directly to the Perundurai - Bhavani road address
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Star+Bags+Perundhurai+-+Bhavani+Rd+Perundurai+Tamil+Nadu+638052";

  return (
    <footer>
      <div className="container">
        {/* Row structured with dynamic flex spacing utilities */}
        <div className="d-flex flex-wrap justify-content-between py-4 links-wrapper">
          
          {/* Brand Info & Social Media */}
          <div className="col-lg-4 col-12 details pe-lg-4">
            <div className="d-flex align-items-end footer-logo gap-2 mb-2">
              {/* <img
                src="../src/assets/images/brand-logo-light.png"
                alt=""
                height={"40px"}
              /> */}
              <a 
                href={mapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="brand-map-link"
              >
                <h5>Star Bags</h5>
              </a>
            </div>
            <p>
              Crafted with passion, our leather goods are designed to bring
              elegance and durability to your everyday life. We believe in
              quality that lasts a lifetime.
            </p>
            <ul className="social-icons">
              <li>
                <a href="#" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Facebook">
                  <FaFacebookF />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter">
                  <FaXTwitter />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Sections */}
          <div className="col-lg-2 col-6 product-details">
            <h6>Sections</h6>
            <ul className="footer-link">
              <li><a href="/">Home</a></li>
              <li><a href="#">All Products</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/#faq-section">FAQ</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6 product-details">
            <h6>Products</h6>
            <ul className="footer-link">
              <li><a href="#">Bags</a></li>
              <li><a href="#">Wallets</a></li>
              <li><a href="#">Belts</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6 product-details">
            <h6>Services</h6>
            <ul className="footer-link">
              <li><a href="#">COD</a></li>
            </ul>
          </div>

          {/* Corrected Address Mapping Link Block */}
          <div className="col-lg-3 col-6 address">
            <h6>Address</h6>
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="d-flex gap-2 address-link"
            >
              <span>
                <FaLocationDot />
              </span>
            <strong>Star Bags</strong></a>
              <div>
                <p>                  
                  Perundhurai - Bhavani Rd, <br />
                  Perundurai, <br />
                  Tamil Nadu - 638052.
                </p>
              </div>
            
          </div>

        </div>

        {/* Bottom Bar Info */}
        <div className="d-flex justify-content-between border-top text-center py-3 footer-end">
          <h6>Star Bags</h6>
          <div className="d-flex gap-3 policy">
            <p className="m-0">Privacy Policy</p>
            <p className="m-0">All rights reserved &copy; {year}</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;