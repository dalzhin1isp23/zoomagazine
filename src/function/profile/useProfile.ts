import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

export interface ProfileUpdateData {
  phone?: string;
  mail?: string;
  status?: 'active' | 'blocked' | 'pending';
  role?: string;
}

export interface UserData {
  _id: string;
  login:string;
  mail?: string;
  phone?: string;
  role: string;
  status?: string;
}

interface ApiSuccessResponse<T> { status: string; message: string; data: T; }

export const useProfile = () => {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiSuccessResponse<UserData>>('/auth/me');
      if (data.status === 'success') setProfile(data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
        return;
      }
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const updateProfile = useCallback(async (updateData: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.patch<ApiSuccessResponse<UserData>>('/profile', updateData);
      if (data.status === 'success') {
        setProfile(prev => prev ? { ...prev, ...data.data } : data.data);
      }
      return data.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
        return;
      }
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return { profile, isLoading, error, fetchProfile, updateProfile };
};