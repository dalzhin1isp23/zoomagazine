import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export interface PetData {
  _id: string;
  name: string;
  animal: string;
  bornDate: string | Date;
  gender: 'Мальчик' | 'Девочка';
  photoUrl: string;
  breed: string;
  tags: string[];
  folderColor?: string;
  personalWishlist?: { product: string; reason?: string }[];
  documents?: Array<{ title: string; fileUrl: string; fileType?: string }>;
}

interface ApiSuccessResponse<T> { status: string; message: string; data: T; }

export const usePets = () => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiSuccessResponse<PetData[]>>('/pets');
      if (data?.status === 'success' && Array.isArray(data.data)) {
        setPets(data.data);
      }
    } catch (err: any) {
      console.error('fetchPets error:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки питомцев');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPet = useCallback(async (petData: {
    name: string;
    animal: string;
    bornDate?: string | Date;
    gender?: 'Мальчик' | 'Девочка';
    photoUrl?: string;
    breed?: string;
    tags?: string[];
    folderColor?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ApiSuccessResponse<PetData>>('/pets', petData);
      if (data?.status === 'success' && data.data) {
        setPets(prev => [...prev, data.data]);
      }
      return data.data;
    } catch (err: any) {
      console.error('addPet error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка добавления питомца';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePet = useCallback(async (petId: string, updateData: Partial<PetData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.patch<ApiSuccessResponse<PetData>>(`/pets/${petId}`, updateData);
      if (data?.status === 'success' && data.data) {
        setPets(prev => prev.map(p => p._id === petId ? { ...p, ...data.data } : p));
      }
      return data.data;
    } catch (err: any) {
      console.error('updatePet error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка обновления питомца';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToPetWishlist = useCallback(async (petId: string, productId: string, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<ApiSuccessResponse<PetData>>(`/pets/${petId}/wishlist`, { productId, reason });
      if (data?.status === 'success' && data.data) {
        setPets(prev => prev.map(p => p._id === petId ? { ...p, ...data.data } : p));
      }
      return data.data;
    } catch (err: any) {
      console.error('addToPetWishlist error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка добавления в избранное';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPetPhoto = useCallback(async (petId: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await api.patch<ApiSuccessResponse<PetData>>(`/pets/${petId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data?.status === 'success' && data.data) {
        setPets(prev => prev.map(p => p._id === petId ? { ...p, ...data.data } : p));
      }
      return data.data;
    } catch (err: any) {
      console.error('uploadPetPhoto error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки фото';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (petId: string, file: File, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', title);
      const { data } = await api.post<ApiSuccessResponse<PetData>>(`/pets/${petId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data?.status === 'success' && data.data) {
        setPets(prev => prev.map(p => p._id === petId ? { ...p, ...data.data } : p));
      }
      return data.data;
    } catch (err: any) {
      console.error('uploadDocument error:', err);
      const msg = err.response?.data?.message || err.message || 'Ошибка загрузки документа';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { pets, isLoading, error, fetchPets, addPet, updatePet, addToPetWishlist, uploadPetPhoto, uploadDocument };
};