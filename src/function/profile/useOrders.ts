import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export interface OrderProduct {
  product: string;
  quantity: number;
}

export interface OrderData {
  _id: string;
  products: OrderProduct[];
  sum: number;
  adressPoint: string;
  status: { name: string };
  createdAt: string;
}

interface ApiSuccessResponse<T> { status: string; message: string;  T; }

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiSuccessResponse<OrderData[]>>('/orders');
      if (data?.status === 'success' && Array.isArray(data.data)) setOrders(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ApiSuccessResponse<OrderData>>('/orders', orderData);
      if (data?.status === 'success' && data.data) setOrders(prev => [...prev, data.data]);
      return data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, statusName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.patch<ApiSuccessResponse<OrderData>>(`/orders/${orderId}/status`, { statusName });
      if (data?.status === 'success' && data.data) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...data.data } : o));
      }
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.delete<ApiSuccessResponse<any>>(`/orders/${orderId}`);
      if (data?.status === 'success') setOrders(prev => prev.filter(o => o._id !== orderId));
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error, fetchOrders, createOrder, updateOrderStatus, removeOrder };
};