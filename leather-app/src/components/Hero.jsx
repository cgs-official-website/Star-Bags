import "../assets/styles/Hero.css";

import productImg from "../assets/images/product.png";
import walletImg from "../assets/images/Wallet.png";
import bagImg from "../assets/images/bag.png";
import beltImg from "../assets/images/Belt.png";

export const Hero = () => {
  return (
    <>
      <section className="hero-section container py-4">
        <div
          id="heroCarousel"
          className="carousel"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-pause="false"
        >

          {/* CAROUSEL */}

          <div className="carousel-inner rounded-4 overflow-hidden">
            {/* SLIDE 1 */}

            <div className="carousel-item active">
              <img
                src={productImg}
                className="hero-img"
                alt="Leather Product"
              />

              <div className="hero-overlay"></div>

              <div className="hero-content">
                <span className="hero-tag">PREMIUM LEATHER</span>

                <h1>Crafted in Leather, Designed for Life.</h1>

                <p>
                  Premium handcrafted leather essentials made for timeless
                  elegance and everyday use.
                </p>

                <button className="btn hero-btn">Shop Now →</button>
              </div>
            </div>

            {/* SLIDE 2 */}

            <div className="carousel-item">
              <img src={walletImg} className="hero-img" alt="Wallet" />

              <div className="hero-overlay"></div>

              <div className="hero-content">
                <span className="hero-tag">PREMIUM LEATHER</span>

                <h1>Crafted in Leather, Designed for Life.</h1>

                <p>
                  Premium handcrafted leather essentials made for timeless
                  elegance and everyday use.
                </p>

                <button className="btn hero-btn">Shop Now →</button>
              </div>
            </div>

            {/* SLIDE 3 */}

            <div className="carousel-item">
              <img src={bagImg} className="hero-img" alt="Bag" />

              <div className="hero-overlay"></div>

              <div className="hero-content">
                <span className="hero-tag">PREMIUM LEATHER</span>

                <h1>Crafted in Leather, Designed for Life.</h1>

                <p>
                  Premium handcrafted leather essentials made for timeless
                  elegance and everyday use.
                </p>

                <button className="btn hero-btn">Shop Now →</button>
              </div>
            </div>

            {/* SLIDE 4 */}

            <div className="carousel-item">
              <img src={beltImg} className="hero-img" alt="Belt" />

              <div className="hero-overlay"></div>

              <div className="hero-content">
                <span className="hero-tag">PREMIUM LEATHER</span>

                <h1>Crafted in Leather, Designed for Life.</h1>

                <p>
                  Premium handcrafted leather essentials made for timeless
                  elegance and everyday use.
                </p>

                <button className="btn hero-btn">Shop Now →</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
