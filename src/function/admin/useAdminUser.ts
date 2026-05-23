import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export interface AdminUser {
  _id: string;
  login: string;
  mail?: string;
  phone?: string;
  createdAt: string;
  role: { _id: string; name: string } | string | null;
}

interface ApiSuccessResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const { data } = await api.get<ApiSuccessResponse<AdminUser[]>>(
        `/admin/users?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success') setUsers(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (userId: string, roleId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.patch<ApiSuccessResponse<AdminUser>>(
        `/admin/users/${userId}/role`,
        { roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.status === 'success' && data.data) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...data.data } : u));
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Ошибка обновления роли');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, error, fetchUsers, updateRole, clearError: () => setError(null) };
};