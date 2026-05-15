import { FaHeart, FaStar, FaTrash, FaMinus, FaPlus } from "react-icons/fa";

import { TbTruckDelivery } from "react-icons/tb";
// import YourCart from "./CouponCart";

const YourCart = () => {
  const products = [
    {
      id: 1,
      title: "Leather Bag",
      price: 120,
      oldPrice: 150,
      discount: "20% off",
      rating: 4.2,
      reviews: 120,
      pattern: "Leather",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
    },
    {
      id: 2,
      title: "Brown Hand Bag",
      price: 220,
      oldPrice: 300,
      discount: "30% off",
      rating: 4.5,
      reviews: 210,
      pattern: "Premium Leather",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
    },
    {
      id: 3,
      title: "Travel Bag",
      price: 320,
      oldPrice: 400,
      discount: "15% off",
      rating: 4.0,
      reviews: 98,
      pattern: "Soft Leather",
      image:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800",
    },
    {
      id: 4,
      title: "Office Bag",
      price: 450,
      oldPrice: 550,
      discount: "25% off",
      rating: 4.8,
      reviews: 320,
      pattern: "Classic Leather",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "20px",
        padding: "20px",
        background: "#f5f5f5",
      }}
    >
      {products.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: "18px",
            background: "#fff",
            padding: "15px",
            borderRadius: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Image */}
          <div
            style={{
              width: "240px",
              height: "240px",
              position: "relative",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "#8b5cf6",
                color: "#fff",
                width: "25px",
                height: "25px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              ✔
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Top */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h2>{item.title}</h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaStar color="gold" />
                  <span>{item.rating}</span>
                  <small style={{ color: "#888" }}>({item.reviews})</small>
                </div>

                <FaHeart color="red" size={22} />
              </div>
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h3>₹ {item.price}</h3>

              <del style={{ color: "#888" }}>₹ {item.oldPrice}</del>

              <span style={{ color: "green" }}>{item.discount}</span>
            </div>

            {/* Pattern */}
            <p>Pattern : {item.pattern}</p>

            {/* Delivery */}
            <p>
              <span>
                <TbTruckDelivery />
              </span>
              Cash On Delivery Available
            </p>

            {/* Quantity */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  border: "1px solid #ddd",
                  padding: "10px 15px",
                  borderRadius: "10px",
                }}
              >
                <FaMinus />
                <span>1</span>
                <FaPlus />
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "15px",
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "30px",
                  background: "#f1e8ff",
                  color: "#ff5f5f",
                  cursor: "pointer",
                }}
              >
                <FaTrash /> Remove
              </button>

              <button
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "30px",
                  background: "#8b5cf6",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Buy this now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourCart;
