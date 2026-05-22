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
  avatar?: string;
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
  uploadAvatar: (file: File) => Promise<boolean>;  
  removeAvatar: () => Promise<boolean>;             
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
  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('avatar', file);
      
      const { data } = await api.patch<ApiResponse<UserProfile>>('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (data?.status === 'success' && data.data) {
        setProfile(data.data);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки аватара';
      setError(msg);
      return false;
    }
  };

  const removeAvatar = async (): Promise<boolean> => {
    try {
      setError(null);
      const { data } = await api.delete<ApiResponse<UserProfile>>('/profile/avatar');
      
      if (data?.status === 'success' && data.data) {
        setProfile(data.data);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Avatar remove error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка удаления аватара';
      setError(msg);
      return false;
    }
  };


  return {
    profile,
    loading,
    error,
    errorField,      
    updateProfile,
    toggleDiscounts,
    refresh: fetchProfile,
    uploadAvatar,    
    removeAvatar,
  };
};