import  { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("user_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("user_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("user_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("user_cart", JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setToasts([{ id, message, type }]); 
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.name === product.name && Number(item.price) === Number(product.price));
      if (exists) {
        showNotification(`Removed "${product.name}" from Wishlist`, "info");
        return prev.filter((item) => !(item.name === product.name && Number(item.price) === Number(product.price)));
      } else {
        showNotification(`Added "${product.name}" to Wishlist!`, "success");
        return [...prev, { ...product, id: product.id || Date.now() + Math.random() }];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        showNotification(`Removed "${item.name}" from Wishlist`, "info");
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.name === product.name && Number(item.price) === Number(product.price));
      if (exists) {
        showNotification(`Increased "${product.name}" quantity inside Cart`, "success");
        return prev.map((item) => 
          item.name === product.name && Number(item.price) === Number(product.price)
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        );
      }
      showNotification(`Added "${product.name}" to Cart!`, "success");
      return [...prev, { ...product, id: product.id || Date.now() + Math.random(), qty: 1, selected: true }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        showNotification(`Removed "${item.name}" from Cart`, "info");
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const updateCartQty = (id, amount) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = (item.qty || 1) + amount;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const toggleCartSelect = (id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      cart, 
      toasts, 
      toggleWishlist, 
      removeFromWishlist, 
      addToCart, 
      removeFromCart,
      updateCartQty,
      toggleCartSelect
    }}>
      {children}
      
      <div className="global-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`custom-toast-popup ${toast.type}`}>
            <div className="toast-body-wrapper">
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-info-circle-fill text-primary'} me-2`}></i>
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </WishlistContext.Provider>
  );
};

// ─── FIX FOR FAST REFRESH WARNING ───
// Assigning the hook to a local variable named using conventional hook standards ("useX") 
// satisfies the build compiler that this file explicitly manages React-only component lifecycle contexts.
const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be wrapped inside a WishlistProvider element block");
  }
  return context;
};

export { useWishlist };