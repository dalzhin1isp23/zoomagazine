import { useState, useEffect, useCallback } from 'react';
import { AdminProduct } from '../../ui/adminpanel/types';

const API_BASE_URL = 'http://127.0.0.1:3000';

interface UseAdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
  status?: string;
}

interface UseAdminProductsReturn {
  products: AdminProduct[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  refetch: () => void;
}

export const useAdminProducts = (params: UseAdminProductsParams = {}): UseAdminProductsReturn => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: params.page || 1,
    limit: params.limit || 20,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.warn('[Admin] No token found');
        setError('Требуется авторизация');
        setIsLoading(false);
        return;
      }
      
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);

      const url = `${API_BASE_URL}/api/admin/products?${queryParams}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error('[Admin] Token expired or invalid');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        throw new Error('Сессия истекла, пожалуйста, войдите снова');
      }

      if (response.status === 403) {
        throw new Error('Доступ запрещён: недостаточно прав');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      
      setProducts(data.products || []);
      setPagination(data.pagination || {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err: any) {
      console.error('[Admin] Fetch error:', err);
      setError(err.message || 'Ошибка загрузки товаров');
    } finally {
      setIsLoading(false);
    }
  }, [params.page, params.limit, params.search, params.category, params.type, params.status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    pagination,
    refetch: fetchProducts,
  };
};

interface UseProductMutationReturn {
  isLoading: boolean;
  error: string | null;
  createProduct: (data: FormData) => Promise<AdminProduct | null>;
  updateProduct: (id: string, data: Partial<AdminProduct>) => Promise<AdminProduct | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  uploadImages: (id: string, files: File[], isMain?: boolean) => Promise<AdminProduct | null>;
  removeImage: (id: string, imageUrl: string) => Promise<AdminProduct | null>;
  setMainImage: (id: string, imageUrl: string) => Promise<AdminProduct | null>;
}

export const useProductMutation = (): UseProductMutationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: FormData): Promise<AdminProduct | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create product');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Error creating product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<AdminProduct>): Promise<AdminProduct | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      console.log('[Admin] updateProduct request:', { id, data });
      
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('[Admin] updateProduct response status:', response.status);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[Admin] updateProduct error:', errData);
        throw new Error(errData.message || 'Failed to update product');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Error updating product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete product');
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Error deleting product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (id: string, files: File[], isMain: boolean = false): Promise<AdminProduct | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('isMain', isMain.toString());

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload images');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Error uploading images');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = async (id: string, imageUrl: string): Promise<AdminProduct | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/images`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to remove image');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Error removing image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setMainImage = async (id: string, imageUrl: string): Promise<AdminProduct | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');
      
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/main-image`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to set main image');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Error setting main image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
    removeImage,
    setMainImage,
  };
};

export const useAdminProduct = (id: string | null) => {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError('ID товара не указан');
      return;
    }

   
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      console.error('[Admin] Invalid product ID format:', id);
      setError('Некорректный ID товара');
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Требуется авторизация');
        
        console.log('[Admin] Fetching product:', id);
        
        const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('[Admin] Product response status:', response.status);

        if (response.status === 404) {
          throw new Error('Товар не найден в базе данных');
        }

        if (response.status === 400) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Некорректный запрос');
        }

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        console.log('[Admin] Product data:', data);
        setProduct(data.data);
      } catch (err: any) {
        console.error('[Admin] Fetch product error:', err);
        setError(err.message || 'Ошибка загрузки товара');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, isLoading, error };
};