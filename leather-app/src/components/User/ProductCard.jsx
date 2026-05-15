// import { IoMdCart } from "react-icons/io";
import "../../assets/styles/productCard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdOutlineShoppingCart } from "react-icons/md";
const ProductCard = () => {
  const productCard = [
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
    {
      image: "../src/assets/images/leather1.png",
      name: "leather wallet",
      rating: 4.2,
      price: "120",
      realPrice: "120",
      offer: "20%",
    },
  ];

  return (
    <>
      <section>
        <div className="ProductCard-section my-3 ">
          <div className="container d-flex gap-3 flex-nowrap">
            {productCard.map((pro, index) => (
              <div key={index} className="card" style={{ width: "15rem" }}>
                <img src={pro.image} className="card-img-top" alt="..." />
                <div className="card-body ">
                  <div className="d-flex  justify-content-between pt-2">
                    <h6 className="card-title">{pro.name}</h6>
                    <span>⭐ {pro.rating}</span>
                  </div>
                  <div className="price-details d-flex align-items-center gap-5 pt-1">
                    <p
                      className="mb-1"
                      style={{ color: "#1A1A1A", fontWeight: "600" }}
                    >
                      ₹{pro.price}{" "}
                      <span>
                        {" "}
                        <del style={{ color: "#7d7d7dff", fontWeight: "500" }}>
                          ₹{pro.realPrice}
                        </del>
                      </span>
                    </p>
                    <span className="mb-1">
                      <b>{pro.offer}off</b>
                    </span>
                  </div>
                  <div className="d-flex gap-3 pt-1">
                    <a href="#" className="btn  ">
                      Buy Now
                    </a>
                    <button
                      className="icon-btn"
                      style={{
                        border: "1px solid #8B5CF6",
                        color: "#8B5CF6",
                        fontSize: "1.4rem",
                      }}
                    >
                      <MdOutlineShoppingCart />
                    </button>
                  </div>
                  <div className="wishlist">
                    <button>
                      <i className="bi bi-heart heart-icon"></i>
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
