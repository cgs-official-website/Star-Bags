import { createContext, useContext, useState, useEffect, useRef } from "react";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("user_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState([]);

  // ─── Track auth state reactively ───────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return unsubscribe;
  }, []);

  // ─── Load wishlist whenever the user changes ────────────────────────────────
  useEffect(() => {
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      if (currentUser) {
        try {
          await currentUser.getIdToken(true);
          const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/wishlist`));
          setWishlist(querySnapshot.docs.map(d => ({ ...d.data(), firestoreId: d.id })));
        } catch (err) {
          console.error("Error loading wishlist from Firestore:", err);
          const saved = localStorage.getItem("user_wishlist");
          setWishlist(saved ? JSON.parse(saved) : []);
        }
      } else {
        const saved = localStorage.getItem("user_wishlist");
        setWishlist(saved ? JSON.parse(saved) : []);
      }
      setWishlistLoading(false);
    };
    fetchWishlist();
  }, [currentUser]);

  // ─── Persist guest wishlist to localStorage only ───────────────────────────
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("user_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

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

  const toggleWishlist = async (product) => {
    const exists = wishlist.find((item) => item.name === product.name && Number(item.price) === Number(product.price));
    
    if (exists) {
      if (currentUser && exists.firestoreId) {
        await deleteDoc(doc(db, `users/${currentUser.uid}/wishlist`, exists.firestoreId));
      }
      setWishlist((prev) => prev.filter((item) => !(item.name === product.name && Number(item.price) === Number(product.price))));
      showNotification(`Removed "${product.name}" from Wishlist`, "info");
    } else {
      const newItem = { ...product, id: product.id || Date.now() + Math.random() };
      if (currentUser) {
        const docRef = doc(collection(db, `users/${currentUser.uid}/wishlist`));
        await setDoc(docRef, newItem);
        newItem.firestoreId = docRef.id;
      }
      setWishlist((prev) => [...prev, newItem]);
      showNotification(`Added "${product.name}" to Wishlist!`, "success");
    }
  };

  const removeFromWishlist = async (id) => {
    const item = wishlist.find((i) => i.id === id);
    if (item) {
      if (currentUser && item.firestoreId) {
        await deleteDoc(doc(db, `users/${currentUser.uid}/wishlist`, item.firestoreId));
      }
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      showNotification(`Removed "${item.name}" from Wishlist`, "info");
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.name === product.name && item.size === product.size);
      if (exists) {
        return prev.map((item) => 
          item.name === product.name && item.size === product.size
            ? { ...item, qty: (item.qty || 1) + (product.qty || 1) }
            : item
        );
      }
      showNotification(`Added "${product.name}" to Cart!`, "success");
      return [...prev, { ...product, id: product.id || Date.now() + Math.random(), qty: product.qty || 1, selected: true }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) showNotification(`Removed "${item.name}" from Cart`, "info");
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
      wishlist, wishlistLoading, cart, toasts, toggleWishlist, removeFromWishlist, addToCart, removeFromCart, updateCartQty, toggleCartSelect, setCart
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

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be wrapped inside a WishlistProvider element block");
  }
  return context;
};

export { WishlistContext, useWishlist };