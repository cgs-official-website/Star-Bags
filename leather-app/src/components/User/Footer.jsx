
import "../../assets/styles/Footer.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// import { FaQ } from "./Faq";


const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>

      <div className="container">
        <div className=" row py-3 ">
          <div className="col-lg-4 col-12 details pe-4">
            <div className="d-flex align-items-end footer-logo gap-2">
              {/* <img
                src="../src/assets/images/brand-logo-light.png"
                alt=""
                height={"40px"}
              /> */}
              <h5>Star Bags</h5>
            </div>
            <p>
              Crafted with passion, our leather goods are designed to bring
              elegance and durability to your everyday life. We believe in
              quality that lasts a lifetime.
            </p>
            <ul className="social-icons">
              <li>
                <a href="#">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="#">
                  <FaWhatsapp />
                </a>
              </li>
              <li>
                <a href="#">
                  <FaXTwitter />
                </a>
              </li>

            </ul>
          </div>
          <div className="col-lg-2 col-6  product-details">
            <h6>Sections</h6>

            <ul className="footer-link">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="#">All Products</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/#faq-section">faq</a>
              </li>

            </ul>
          </div>
          <div className="col-lg-2 col-6  product-details">
            <h6>Products</h6>

            <ul className="footer-link">
              <li>
                <a href="#">Bags</a>
              </li>
              <li>
                <a href="#">wallets</a>
              </li>
              <li>
                <a href="#">belts</a>
              </li>

            </ul>
          </div>
          <div className="col-lg-2 col-6  product-details">
            <h6>Services</h6>

            <ul className="footer-link">
              <li>
                <a href="#">COD</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-6 address   ">
            <h6 className="text">Address of Company,</h6>
            <div className="d-flex gap-2">
              <span>
                <FaLocationDot />
              </span>
              <div>
                <p>
                  Star Bags <br />
                  No.24, Anna Salai, T.Nagar, Chennai, TamilNadu-600017, India.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between border-top text-center py-3  footer-end">
          <h6>Star Bags</h6>
          <div className="d-flex gap-3 policy">
            <p>Privacy Policy </p>
            <p>All rights reserved &copy; {year}</p>

          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;

