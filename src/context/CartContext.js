import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "suplimente_cart";

// Line items are shaped as:
//   { _id, name, price, image, qty }
// We only persist the minimum fields we need to render the cart page; we
// never trust price from localStorage for anything but display.
const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const writeStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // quota or privacy mode — ignore
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage());

  // Persist on every change
  useEffect(() => {
    writeStorage(items);
  }, [items]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setItems(readStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((supplement, qty = 1) => {
    if (!supplement || !supplement._id) return;
    setItems((prev) => {
      const existing = prev.find((i) => i._id === supplement._id);
      if (existing) {
        return prev.map((i) =>
          i._id === supplement._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          _id: supplement._id,
          name: supplement.name,
          price: Number(supplement.price) || 0,
          image: supplement.image || "",
          qty,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i._id !== id);
      return prev.map((i) => (i._id === id ? { ...i, qty } : i));
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;
    for (const i of items) {
      count += i.qty;
      price += i.qty * (Number(i.price) || 0);
    }
    return { totalCount: count, totalPrice: price };
  }, [items]);

  const isInCart = useCallback(
    (id) => items.some((i) => i._id === id),
    [items]
  );

  const getItem = useCallback(
    (id) => items.find((i) => i._id === id) || null,
    [items]
  );

  const value = {
    items,
    totalCount,
    totalPrice,
    addItem,
    updateQty,
    removeItem,
    clear,
    isInCart,
    getItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
