import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export interface CheckoutProduct {
  product: string;
  quantity: number;
  price: number;
  name: string;
}

export interface VetDocument {
  url: string;
  filename: string;
}

export interface CreateOrderPayload {
  products: CheckoutProduct[];
  sum: number;
  adressPoint: string;
  city?: string;
  deliveryMethod?: 'courier' | 'pickup';
  paymentMethod?: 'card' | 'cash';
  promoCode?: string;
  comment?: string;
}

interface ApiSuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface OrderData {
  _id: string;
  user: string;
  products: Array<{
    product: { _id: string; name: string; price: number; images?: any[] };
    quantity: number;
    price: number;
    name: string;
  }>;
  sum: number;
  adressPoint: string;
  city?: string;
  deliveryMethod: 'courier' | 'pickup';
  paymentMethod: 'card' | 'cash';
  status: { _id: string; name: string };
  hasVetMedicine: boolean;
  vetDocuments: VetDocument[];
  createdAt: string;
  updatedAt: string;
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (
    payload: CreateOrderPayload
  ): Promise<OrderData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.post<ApiSuccessResponse<OrderData>>('/orders', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.status === 'success' && data.data) {
        return data.data;
      }
      throw new Error(data?.message || 'Не удалось создать заказ');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка при создании заказа';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadVetDocument = useCallback(async (
    orderId: string,
    file: File
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const formData = new FormData();
      formData.append('document', file);

      const { data } = await api.post<ApiSuccessResponse<any>>(
        `/orders/${orderId}/vet-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return data?.status === 'success';
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки документа';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrders = useCallback(async (): Promise<OrderData[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.get<ApiSuccessResponse<OrderData[]>>('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.status === 'success' && Array.isArray(data.data)) {
        return data.data;
      }
      throw new Error(data?.message || 'Не удалось загрузить заказы');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки заказов';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createOrder,
    uploadVetDocument,
    getOrders,
    clearError: () => setError(null)
  };
};