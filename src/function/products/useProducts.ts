import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api/api';
import { ProductData, Pagination, SortOption } from './filtration/types';

export interface ProductFilters {
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  hasDiscount?: boolean;
  search?: string;
}

export interface UseProductsOptions {
  initialLimit?: number;
  initialSort?: SortOption;
  autoFetch?: boolean;
}

export interface UseProductsReturn {
  products: ProductData[];
  pagination: Pagination;
  filters: ProductFilters;
  sort: SortOption;
  isLoading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setFilters: (newFilters: Partial<ProductFilters>) => void;
  setSort: (newSort: SortOption) => void;
  reset: () => void;
  refetch: () => Promise<void>;
}

export const useProducts = (
  options: UseProductsOptions = {}
): UseProductsReturn => {
  const {
    initialLimit = 9,
    initialSort = 'newest',
    autoFetch = true,
  } = options;

  const [products, setProducts] = useState<ProductData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFiltersState] = useState<ProductFilters>({});
  const [sort, setSortState] = useState<SortOption>(initialSort);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBackendSortParam = useCallback((frontendSort: SortOption): string => {
    const sortMap: Record<SortOption, string> = {
      'popularity': '-_id',
      'price-asc': 'price',
      'price-desc': '-price',
      'newest': '-_id',
    };
    return sortMap[frontendSort] || '-_id';
  }, []);

  const buildQueryParams = useCallback(
    (
      page: number,
      limit: number,
      activeFilters: ProductFilters,
      activeSort: SortOption
    ): URLSearchParams => {
      const params = new URLSearchParams();

      params.append('page', String(page));
      params.append('limit', String(limit));

      if (activeFilters.category) params.append('category', activeFilters.category);
      if (activeFilters.type) params.append('type', activeFilters.type);
      if (activeFilters.minPrice) params.append('minPrice', String(activeFilters.minPrice));
      if (activeFilters.maxPrice) params.append('maxPrice', String(activeFilters.maxPrice));
      if (activeFilters.inStock) params.append('inStock', 'true');
      if (activeFilters.hasDiscount) params.append('hasDiscount', 'true');
      if (activeFilters.search) params.append('search', activeFilters.search);

      params.append('sort', getBackendSortParam(activeSort));

      return params;
    },
    [getBackendSortParam]
  );

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = buildQueryParams(
        pagination.page,
        pagination.limit,
        filters,
        sort
      );

      const response = await api.get<{
        success: boolean;
        products?: ProductData[];
        pagination?: Pagination;
      }>(`/products?${queryParams.toString()}`);

      const responseData = response.data;

      if (responseData?.success) {
        setProducts(responseData.products || []);
        if (responseData.pagination) {
          setPagination((prev) => ({ ...prev, ...responseData.pagination }));
        }
      } else {
        throw new Error(responseData?.message || 'Ошибка загрузки товаров');
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд на порту 3000.');
      } else {
        const msg = err.response?.data?.message || err.message || 'Ошибка сети';
        setError(msg);
      }
      console.error('[useProducts] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort, buildQueryParams]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const setSort = useCallback((newSort: SortOption) => {
    setSortState(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setFiltersState({});
    setSortState(initialSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  }, [initialSort, fetchProducts]);

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    pagination,
    filters,
    sort,
    isLoading,
    error,
    setPage,
    setFilters,
    setSort,
    reset,
    refetch,
  };
};

export default useProducts;