import { useState, useCallback } from 'react';
import { api } from '../../api/api';
import { ProductData } from '../products/filtration/types';

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
      if (data?.status === 'success' && Array.isArray(data.data)) {
        setFavorites(data.data);
      }
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
      const { data } = await api.post<ApiSuccessResponse<ProductData[]>>(`/favorites/${productId}`);
      if (data?.status === 'success') {
        setFavorites(data.data || []);
      }
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      await fetchFavorites();
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFavorites]);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(p => p._id === productId);
  }, [favorites]);

  return { 
    favorites, 
    isLoading, 
    error, 
    fetchFavorites, 
    toggleFavorite,
    isFavorite 
  };
};