import { useState, useEffect } from "react";
import "../../assets/styles/Hero.css";
import productImg from "../../assets/images/product.png";
import { NavLink } from "react-router-dom";
import { ScrollBanner } from "./ScrollBanner";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "banners"));
        const activeBanners = [];
        querySnapshot.forEach((doc) => {
          if (doc.id === "offer-banner-texts") return;
          const data = doc.data();
          if (data.status === "ACTIVE") {
            activeBanners.push({ id: doc.id, ...data });
          }
        });

        // Sort by slotIndex to maintain order
        activeBanners.sort((a, b) => (a.slotIndex || 0) - (b.slotIndex || 0));

        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!loading) {
      const carouselEl = document.getElementById("heroCarousel");
      if (carouselEl && window.bootstrap) {
        const carousel = new window.bootstrap.Carousel(carouselEl, {
          interval: 6000,
          ride: "carousel",
          pause: false,
        });
        carousel.cycle();
      }
    }
  }, [loading, banners]);

  const formatTitle = (title) => {
    if (!title) return null;
    const words = title.split(" ");
    if (words.length > 1) {
      const before = words[0];
      const secondWord = words[1];
      const after = words.slice(2).join(" ");
      return (
        <>
          {before} <span className="hero-design">{secondWord}</span> {after}
        </>
      );
    }
    return title;
  };

  return (
    <>
      <ScrollBanner />

      <section className="hero-section container py-4">
        <div
          id="heroCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-pause="false"
        >
          <div className="carousel-inner rounded-4 overflow-hidden">
            {loading ? (
              <div className="carousel-item active">
                <div
                  style={{
                    width: "100%",
                    height: "500px",
                    background: "#e5e7eb",
                    animation: "pulse 2s infinite",
                  }}
                ></div>
              </div>
            ) : banners.length > 0 ? (
              banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={banner.image || productImg}
                    className="hero-img"
                    alt={banner.title || "Banner"}
                  />
                  <div className="hero-overlay"></div>
                  <div className="hero-content">
                    <h2 >
                      {formatTitle(banner.title)}
                    </h2>
                    <p>{banner.subtitle}</p>
                    <NavLink
                      to={banner.redirectLink || "/AllProducts"}
                      className="btn hero-btn"
                    >
                      {banner.ctaText || "Shop Now"}
                    </NavLink>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback if no active banners */
              <div className="carousel-item active">
                <img
                  src={productImg}
                  className="hero-img"
                  alt="Leather Product"
                />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h2 style={{ fontFamily: '"Playfair Display", serif' }}>
                    Crafted in Leather,{" "}
                    <span className="hero-design">Designed</span> for Life.
                  </h2>
                  <p>
                    Premium handcrafted leather essentials made for timeless
                    elegance and everyday use.
                  </p>
                  <NavLink to={"/AllProducts"} className="btn hero-btn">
                    Shop Now{" "}
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};








// import "../../assets/styles/Hero.css";

// import productImg from "../../assets/images/product.png";
// import walletImg from "../../assets/images/Wallet.png";
// import bagImg from "../../assets/images/bag.png";
// import beltImg from "../../assets/images/Belt.png";
// import { NavLink } from "react-router-dom";
// import { ScrollBanner } from "./ScrollBanner";

// export const Hero = () => {
//   return (
//     <>
//       <ScrollBanner />

//       <section className="hero-section container py-4">
//         <div
//           id="heroCarousel"
//           className="carousel"
//           data-bs-ride="carousel"
//           data-bs-interval="5000"
//           data-bs-pause="false"
//         >
//           {/* CAROUSEL */}

//           <div className="carousel-inner rounded-4 overflow-hidden">
//             {/* SLIDE 1 */}

//             <div className="carousel-item active">
//               <img
//                 src={productImg}
//                 className="hero-img"
//                 alt="Leather Product"
//               />

//               <div className="hero-overlay"></div>
//               <div className="hero-content">
//                 {/* <span className="hero-tag">PREMIUM LEATHER</span> */}

//                 <h2>
//                   Crafted in Leather,{" "}
//                   <span className="hero-design">Designed</span> for Life.
//                 </h2>

//                 <p>
//                   Premium handcrafted leather essentials made for timeless
//                   elegance and everyday use.
//                 </p>

//                 <NavLink to={"/AllProducts"} className="btn hero-btn">
//                   Shop Now{" "}
//                 </NavLink>
//               </div>
//             </div>

//             {/* SLIDE 2 */}

//             <div className="carousel-item">
//               <img src={walletImg} className="hero-img" alt="Wallet" />
//               <div className="hero-overlay"></div>

//               <div className="hero-content">
//                 {/* <span className="hero-tag">PREMIUM LEATHER</span> */}

//                 <h2>
//                   Crafted in Leather,{" "}
//                   <span className="hero-design">Designed</span> for Life.
//                 </h2>

//                 <p>
//                   Premium handcrafted leather essentials made for timeless
//                   elegance and everyday use.
//                 </p>
//                 <NavLink to={"/AllProducts"} className="btn hero-btn">
//                   Shop Now{" "}
//                 </NavLink>
//               </div>
//             </div>

//             {/* SLIDE 3 */}

//             <div className="carousel-item">
//               <img src={bagImg} className="hero-img" alt="Bag" />
//               <div className="hero-overlay"></div>
//               <div className="hero-content">
//                 {/* <span className="hero-tag">PREMIUM LEATHER</span> */}

//                 <h2>
//                   Crafted in Leather,{" "}
//                   <span className="hero-design">Designed</span> for Life.
//                 </h2>

//                 <p>
//                   Premium handcrafted leather essentials made for timeless
//                   elegance and everyday use.
//                 </p>
//                 <NavLink to={"/AllProducts"} className="btn hero-btn">
//                   Shop Now{" "}
//                 </NavLink>
//               </div>
//             </div>

//             {/* SLIDE 4 */}

//             <div className="carousel-item">
//               <img src={beltImg} className="hero-img" alt="Belt" />
//               <div className="hero-overlay"></div>
//               <div className="hero-content">
//                 {/* <span className="hero-tag">PREMIUM LEATHER</span> */}

//                 <h2>
//                   Crafted in Leather,{" "}
//                   <span className="hero-design">Designed</span> for Life.
//                 </h2>

//                 <p>
//                   Premium handcrafted leather essentials made for timeless
//                   elegance and everyday use.
//                 </p>
//                 <NavLink to={"/AllProducts"} className="btn hero-btn">
//                   Shop Now{" "}
//                 </NavLink>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };