import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api/api';

export interface Category {
  _id: string;
  name: string;
}

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories');

      if (data?.success) {
        setCategories(data.data || []);
      } else {
        throw new Error(data?.message || 'Ошибка загрузки категорий');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка сети';
      setError(msg);
      console.error('[useCategories] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
  };
};

export default useCategories;