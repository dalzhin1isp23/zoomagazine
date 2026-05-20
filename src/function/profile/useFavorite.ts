import { useState, useCallback } from 'react';
import { api } from '../../api/api';
import { ProductData } from '../../function/products/filtration/types';

interface ApiSuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiSuccessResponse<ProductData[]>>('/favorites');
      if (data?.status === 'success' && Array.isArray(data.data)) setFavorites(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки избранного');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ApiSuccessResponse<any>>(`/favorites/${productId}`);
      if (data?.status === 'success') await fetchFavorites();
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFavorites]);

  return { favorites, isLoading, error, fetchFavorites, toggleFavorite };
};