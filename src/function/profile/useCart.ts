import { useState, useEffect, useCallback } from 'react';
import { CartItem, CartState } from '../../types';
import { api } from '../../api/api';

const CART_STORAGE_KEY = 'cart_items';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartState = JSON.parse(stored);
        setItems(parsed.items || []);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Не удалось загрузить корзину');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCart = useCallback((newItems: CartItem[]) => {
    try {
      const cartState: CartState = {
        items: newItems,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      setItems(newItems);
    } catch (err) {
      console.error('Error saving cart:', err);
      setError('Не удалось сохранить корзину');
    }
  }, []);

  const isInCart = useCallback((productId: string): boolean => {
    return items.some(item => item.product._id === productId);
  }, [items]);

  const getQuantity = useCallback((productId: string): number => {
    const item = items.find(i => i.product._id === productId);
    return item?.quantity || 0;
  }, [items]);

  const addToCart = useCallback(async (
    productId: string, 
    quantity: number = 1,
    productData?: any
  ): Promise<boolean> => {
    setError(null);
    
    if (!productId || quantity <= 0) {
      setError('Некорректные данные товара');
      return false;
    }

    let product = productData;
    if (!product) {
      try {
        const { data } = await api.get(`/products/${productId}`);
        product = data.data;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Не удалось загрузить товар');
        return false;
      }
    }

    const available = product.remains ?? 0;
    const currentQty = getQuantity(productId);
    
    if (currentQty + quantity > available) {
      setError(`Доступно только ${available} шт. (в корзине уже ${currentQty})`);
      return false;
    }

    const newItems = [...items];
    const existingIndex = newItems.findIndex(i => i.product._id === productId);

    if (existingIndex >= 0) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity
      };
    } else {
      newItems.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          remains: product.remains,
          isVetMedicine: product.isVetMedicine,
          images: product.images,
          category: product.category,
          type: product.type
        },
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    saveCart(newItems);
    return true;
  }, [items, getQuantity, saveCart]);

  const updateQuantity = useCallback((productId: string, quantity: number): boolean => {
    if (quantity < 1) return removeItem(productId);
    
    const item = items.find(i => i.product._id === productId);
    if (!item) return false;

    if (quantity > (item.product.remains ?? 0)) {
      setError(`Доступно только ${item.product.remains} шт.`);
      return false;
    }

    const newItems = items.map(i => 
      i.product._id === productId ? { ...i, quantity } : i
    );
    
    saveCart(newItems);
    return true;
  }, [items, saveCart]);

  const removeItem = useCallback((productId: string): boolean => {
    const newItems = items.filter(i => i.product._id !== productId);
    saveCart(newItems);
    return true;
  }, [items, saveCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const totals = useCallback(() => {
    const FREE_DELIVERY_THRESHOLD = 3000;
    const DELIVERY_COST = 300;

    const subtotal = items.reduce((sum, item) => {
      const price = item.product.discount && item.product.discount > 0
        ? Math.round(item.product.price * (1 - item.product.discount / 100))
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 
      ? 0 
      : DELIVERY_COST;
    
    const total = subtotal + delivery;

    return { subtotal, delivery, total, totalItems };
  }, [items]);

  const syncStock = useCallback(async () => {
    if (items.length === 0) return;
    
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const { data } = await api.get(`/products/${item.product._id}`);
          const freshProduct = data.data;
          
          if (!freshProduct || (item.quantity > (freshProduct.remains ?? 0))) {
            return {
              ...item,
              product: {
                ...item.product,
                remains: freshProduct?.remains ?? 0,
                isVetMedicine: freshProduct?.isVetMedicine
              },
              quantity: Math.min(item.quantity, freshProduct?.remains ?? 0)
            };
          }
          
          return {
            ...item,
            product: {
              ...item.product,
              remains: freshProduct.remains,
              price: freshProduct.price,
              discount: freshProduct.discount,
              isVetMedicine: freshProduct.isVetMedicine
            }
          };
        } catch {
          return item;
        }
      })
    );
    
    saveCart(updatedItems);
  }, [items, saveCart]);

  return {
    items,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    getQuantity,
    totals,
    syncStock,
    refresh: () => saveCart([...items]) 
  };
};