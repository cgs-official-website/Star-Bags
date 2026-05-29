import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

/**
 * Normalizes a Firestore product document into the shape
 * expected by ProductCard, Allproducts, and SearchContext.
 */
const normalizeProduct = (docId, data) => {
  const originalPrice = Number(data.realPrice ?? data.price ?? 0);
  const discountPercent = Number(data.discount ?? 0);
  const discountedPrice = discountPercent > 0
    ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
    : originalPrice;

  return {
    id:          data.id        ?? docId,
    productId:   data.id        ?? docId,
    name:        data.name      ?? '',
    category:    (data.category ?? '').toLowerCase(),
    brand:       data.brand     ?? '',
    brandName:   data.brand     ?? '',
    description: data.description ?? '',
    price:       String(discountedPrice),
    realPrice:   String(originalPrice),
    discount:    String(discountPercent),
    offer:       discountPercent > 0 ? `${discountPercent}%` : '',
    rating:      data.rating    ?? 0,
    capacity:    data.capacity  ?? '',
    size:        data.size      ?? '',
    material:    data.material  ?? '',
    subCategory: data.subCategory ?? '',
    image:       data.image     ?? (Array.isArray(data.images) ? data.images[0] : ''),
    images:      Array.isArray(data.images) ? data.images : [],
    createdAt:   data.createdAt ?? null,
    stocks:      data.stocks    ?? null,
  };
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        if (!cancelled) {
          const docs = snapshot.docs.map((doc) =>
            normalizeProduct(doc.id, doc.data())
          );
          setProducts(docs);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch products from Firestore:', err);
          setError(err.message ?? 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};
