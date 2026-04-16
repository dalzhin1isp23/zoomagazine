import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api/api';

export interface ProductType {
  _id: string;
  name: string;
}

export interface UseTypesReturn {
  types: ProductType[];
  isLoading: boolean;
  error: string | null;
}

export const useTypes = (): UseTypesReturn => {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<{ success: boolean; data: ProductType[] }>('/types');

      if (data?.success) {
        setTypes(data.data || []);
      } else {
        throw new Error(data?.message || 'Ошибка загрузки типов');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка сети';
      setError(msg);
      console.error('[useTypes] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  return {
    types,
    isLoading,
    error,
  };
};

export default useTypes;