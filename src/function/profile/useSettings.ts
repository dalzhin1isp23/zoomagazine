import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/api';



export interface UserNotifications {
  discounts?: boolean;
}

export interface UserProfile {
  _id?: string;
  login?: string;      
  phone?: string;
  mail?: string;
  notifications: UserNotifications;
  status?: 'active' | 'blocked' | 'pending';
  isVerified?: boolean;
}

export interface ProfileUpdatePayload {
  login?: string;        
  phone?: string;
  mail?: string;
  notifications?: UserNotifications;
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  field?: string;        
}

export interface UseProfileSettingsReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  errorField: string | null;  
  updateProfile: (data: ProfileUpdatePayload) => Promise<boolean>;
  toggleDiscounts: () => Promise<void>;
  refresh: () => Promise<void>;
}


const profileApi = {
  get: () => {
    return api.get<ApiResponse<UserProfile>>('/profile')
      .then(res => res.data.data!);
  },

  update: (payload: ProfileUpdatePayload) => {
    return api.patch<ApiResponse<UserProfile>>('/profile', payload)
      .then(res => res.data.data!);
  },
};

export const useProfileSettings = (): UseProfileSettingsReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null); 

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorField(null);
      const data = await profileApi.get();
      setProfile(data);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      const msg = err.response?.data?.message || err.message || 'Не удалось загрузить профиль';
      setError(msg);
      setErrorField(err.response?.data?.field || null);
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (payload: ProfileUpdatePayload): Promise<boolean> => {
    try {
      setError(null);
      setErrorField(null);
      const updated = await profileApi.update(payload);
      setProfile(updated);
      return true;
    } catch (err: any) {
      console.error('Profile update error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка при сохранении';
      setError(msg);
      setErrorField(err.response?.data?.field || null); 
      return false;
    }
  };

  const toggleDiscounts = async (): Promise<void> => {
    if (!profile) return;
    const previous = { ...profile };
    const newNotifications = {
      ...profile.notifications,
      discounts: !profile.notifications?.discounts,
    };
    setProfile({ ...profile, notifications: newNotifications });
    const success = await updateProfile({ notifications: newNotifications });
    if (!success) setProfile(previous);
  };

  return {
    profile,
    loading,
    error,
    errorField,      
    updateProfile,
    toggleDiscounts,
    refresh: fetchProfile,
  };
};