import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";

const YourCart = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Leather Bag",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
      price: 120,
      oldPrice: 150,
      qty: 1,
      rating: 4.2,
      wishlist: false,
    },
    {
      id: 2,
      name: "Leather Wallet",
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800",
      price: 220,
      oldPrice: 300,
      qty: 1,
      rating: 4.5,
      wishlist: false,
    },
  ]);

  // Increase Qty
  const increaseQty = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease Qty
  const decreaseQty = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  // Wishlist Toggle
  const toggleWishlist = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id
          ? { ...item, wishlist: !item.wishlist }
          : item
      )
    );
  };

  // Remove Product
  const removeProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      {products.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Image */}
            <div
              style={{
                flex: "1 1 300px",
                position: "relative",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />

              <input
                type="checkbox"
                defaultChecked
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  width: "22px",
                  height: "22px",
                  accentColor: "#8b5cf6",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ flex: "2 1 400px" }}>
              {/* Top */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    margin: "0",
                  }}
                >
                  {item.name}
                </h2>

                <div
                  onClick={() => toggleWishlist(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  {item.wishlist ? (
                    <FaHeart size={28} color="red" />
                  ) : (
                    <FaRegHeart size={28} color="red" />
                  )}
                </div>
              </div>

              {/* Rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "10px",
                }}
              >
                <span style={{ color: "#facc15", fontSize: "22px" }}>
                  ★
                </span>

                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  {item.rating}
                </span>

                <span
                  style={{
                    color: "#999",
                    fontSize: "18px",
                  }}
                >
                  (120)
                </span>
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    fontSize: "38px",
                    margin: 0,
                    fontWeight: "700",
                  }}
                >
                  ₹ {item.price}
                </h3>

                <del
                  style={{
                    color: "#999",
                    fontSize: "24px",
                  }}
                >
                  ₹ {item.oldPrice}
                </del>

                <span
                  style={{
                    color: "green",
                    fontWeight: "600",
                    fontSize: "24px",
                  }}
                >
                  20% off
                </span>
              </div>

              {/* Pattern */}
              <p
                style={{
                  marginTop: "20px",
                  fontSize: "22px",
                }}
              >
                Pattern : Leather
              </p>

              {/* COD */}
              <p
                style={{
                  fontSize: "22px",
                }}
              >
                🚚 Cash On Delivery Available
              </p>

              {/* Bottom */}
              <div
                style={{
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                {/* Qty */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => decreaseQty(item.id)}
                    style={{
                      border: "none",
                      background: "#fff",
                      padding: "12px 18px",
                      cursor: "pointer",
                    }}
                  >
                    <FaMinus />
                  </button>

                  <span
                    style={{
                      padding: "0 20px",
                      fontSize: "22px",
                      fontWeight: "700",
                    }}
                  >
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    style={{
                      border: "none",
                      background: "#fff",
                      padding: "12px 18px",
                      cursor: "pointer",
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => removeProduct(item.id)}
                    style={{
                      border: "none",
                      background: "#efe3ff",
                      color: "#ff5a5a",
                      padding: "14px 35px",
                      borderRadius: "14px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash style={{ marginRight: "8px" }} />
                    Remove
                  </button>

                  <button
                    style={{
                      border: "none",
                      background:
                        "linear-gradient(to right, #8b5cf6, #7c3aed)",
                      color: "#fff",
                      padding: "14px 45px",
                      borderRadius: "14px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Buy this now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourCart;