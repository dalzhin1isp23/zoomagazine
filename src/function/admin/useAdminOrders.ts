import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export const STATUS_NAME_MAP: Record<string, string> = {
  '6a0d78968c9a243088c4b24b': 'Новый',
  '6a0d78968c9a243088c4b24c': 'В обработке',
  '6a0d78968c9a243088c4b24d': 'Доставлен',
  '6a0d78968c9a243088c4b24e': 'Отменён'
};

export interface AdminOrderProduct {
  _id: string;
  name: string;
  price: number;
  images?: Array<{ url: string; isMain?: boolean }>;
  isVetMedicine?: boolean;
  remains?: number;
}

export interface AdminOrderItem {
  product: AdminOrderProduct;
  quantity: number;
  price: number;
  name: string;
}

export interface AdminOrderUser {
  _id: string;
  login: string;
  mail?: string;
  phone?: string;
}

export interface VetDocument {
  url: string;
  filename: string;
  uploadedAt: string;
  isVerified?: boolean;
  verifiedAt?: string;
  adminNote?: string;
}

export interface AdminOrder {
  _id: string;
  user: AdminOrderUser;
  products: AdminOrderItem[];
  sum: number;
  adressPoint: string;
  city?: string;
  deliveryMethod?: 'courier' | 'pickup';
  paymentMethod?: 'card' | 'cash';
  status: string; 
  createdAt: string;
  updatedAt: string;
  hasVetMedicine: boolean;
  vetDocuments: VetDocument[];
  dateSending?: string;
  dateFinal?: string;
  payed: boolean;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminOrderFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  hasVetMedicine?: boolean;
  limit?: number;
  page?: number;
}

interface ApiSuccessResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (filters: AdminOrderFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.hasVetMedicine === true) params.append('hasVetMedicine', 'true');
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.page) params.append('page', String(filters.page));

      const { data } = await api.get<ApiSuccessResponse<AdminOrdersResponse>>(
        `/admin/orders?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success' && data.data) {
        setOrders(data.data.orders);
        setPagination({
          total: data.data.total,
          page: data.data.page,
          totalPages: data.data.totalPages
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки заказов';
      setError(msg);
      console.error(' fetchOrders error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, statusName: string): Promise<AdminOrder | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.patch<ApiSuccessResponse<AdminOrder>>(
        `/admin/orders/${orderId}/status`,
        { statusName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success' && data.data) {
        return data.data;
      }
      return null;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка обновления статуса';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyVetDocuments = useCallback(async (
    orderId: string, 
    isVerified: boolean, 
    adminNote?: string
  ): Promise<{ order: AdminOrder | null; success: boolean }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.patch<ApiSuccessResponse<AdminOrder>>(
        `/admin/orders/${orderId}/vet-verify`,
        { isVerified, adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success' && data.data) {
        return { order: data.data, success: true };
      }
      return { order: null, success: false };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка проверки документов';
      setError(msg);
      return { order: null, success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.delete<ApiSuccessResponse<any>>(
        `/admin/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success') {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка удаления заказа';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    orders,
    pagination,
    isLoading,
    error,
    fetchOrders,
    updateOrderStatus,
    verifyVetDocuments,
    deleteOrder,
    clearError: () => setError(null)
  };
};