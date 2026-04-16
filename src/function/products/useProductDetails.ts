import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api/api';
import { ProductData } from './filtration/types';

export interface UseProductReturn {
  product: ProductData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductDetails = (productId: string | undefined): UseProductReturn => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 👇 Бэкенд возвращает { success, data: ProductData }
      const response = await api.get<{
        success: boolean;
        data?: ProductData;
      }>(`/products/${productId}`);

      const responseData = response.data;

      if (responseData?.success) {
        // 👇 Читаем из data, а не product
        setProduct(responseData.data || null);
      } else {
        throw new Error(responseData?.message || 'Ошибка загрузки товара');
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд на порту 3000.');
      } else {
        const msg = err.response?.data?.message || err.message || 'Ошибка сети';
        setError(msg);
      }
      console.error('[useProductDetails] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
};

export default useProductDetails;