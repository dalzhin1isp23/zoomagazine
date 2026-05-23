import { useState, useCallback } from 'react';
import { api } from '../../api/api';

export interface ReviewUser { _id: string; login: string; avatar?: string; }
export interface ReviewImage { url: string; filename: string; }
export interface Review {
  _id: string; product: string; user: ReviewUser; rating: number; title?: string; comment: string;
  images?: ReviewImage[]; isVerified: boolean; isApproved: boolean; adminNote?: string; helpfulCount: number; createdAt: string; updatedAt: string;
}
export interface ReviewStats { averageRating: number; totalReviews: number; distribution: { [key: number]: number }; }
export interface ReviewsResponse { 
  reviews: Review[]; 
  pagination: { total: number; page: number; limit: number; totalPages: number }; 
  stats: ReviewStats; 
}
interface ApiSuccessResponse<T> { status: string; message?: string; data: T; }

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (options: { 
    page?: number; 
    limit?: number; 
    sortBy?: 'newest' | 'oldest' | 'rating' | 'helpful' 
  } = {}) => {
    if (!productId) return;
    setIsLoading(true); 
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', String(options.page));
      if (options.limit) params.append('limit', String(options.limit));
      if (options.sortBy) params.append('sortBy', options.sortBy);
      
      console.log(' useReviews fetch:', `/products/${productId}/reviews?${params.toString()}`);
      
      const { data } = await api.get<ApiSuccessResponse<ReviewsResponse>>(
        `/products/${productId}/reviews?${params.toString()}`, 
        { headers }
      );
      
      console.log(' useReviews response:', data);
      
      if (data?.status === 'success' && data.data) {
        setReviews(data.data.reviews); 
        setStats(data.data.stats);
        setPagination({ 
          page: data.data.pagination.page, 
          totalPages: data.data.pagination.totalPages 
        });
      }
    } catch (err: any) { 
      console.error(' useReviews error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки отзывов'); 
    } finally { 
      setIsLoading(false); 
    }
  }, [productId]);

  const createReview = useCallback(async (input: { 
    rating: number; 
    title?: string; 
    comment: string; 
    images?: Array<{ url: string; filename: string }> 
  }): Promise<{ success: boolean; needsEdit?: boolean }> => {
    if (!productId) return { success: false };
    setIsLoading(true); 
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token'); 
      if (!token) throw new Error('Требуется авторизация');
      
      const { data } = await api.post<ApiSuccessResponse<Review>>(
        '/reviews', 
        { productId, ...input }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data?.status === 'success' && data.data) { 
        setReviews(prev => [data.data as Review, ...prev]); 
        return { success: true }; 
      }
      return { success: false };
    } catch (err: any) {
      if (err.response?.status === 409) return { success: false, needsEdit: true };
      setError(err.response?.data?.message || err.message || 'Ошибка создания отзыва'); 
      return { success: false };
    } finally { 
      setIsLoading(false); 
    }
  }, [productId]);

  const updateReview = useCallback(async (reviewId: string, updates: { 
    rating?: number; 
    title?: string; 
    comment?: string 
  }): Promise<boolean> => {
    setIsLoading(true); 
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token'); 
      if (!token) throw new Error('Требуется авторизация');
      
      const { data } = await api.patch<ApiSuccessResponse<Review>>(
        `/reviews/${reviewId}`, 
        updates, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data?.status === 'success' && data.data) { 
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, ...data.data } : r)); 
        return true; 
      }
      return false;
    } catch (err: any) { 
      setError(err.response?.data?.message || err.message || 'Ошибка обновления отзыва'); 
      return false; 
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    setIsLoading(true); 
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token'); 
      if (!token) throw new Error('Требуется авторизация');
      
      const { data } = await api.delete<ApiSuccessResponse<any>>(
        `/reviews/${reviewId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data?.status === 'success') { 
        setReviews(prev => prev.filter(r => r._id !== reviewId)); 
        return true; 
      }
      return false;
    } catch (err: any) { 
      setError(err.response?.data?.message || err.message || 'Ошибка удаления отзыва'); 
      return false; 
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  const markHelpful = useCallback(async (reviewId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token'); 
      if (!token) return false;
      
      const { data } = await api.post<ApiSuccessResponse<{ helpfulCount: number }>>(
        `/reviews/${reviewId}/helpful`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data?.status === 'success') { 
        setReviews(prev => prev.map(r => 
          r._id === reviewId ? { ...r, helpfulCount: data.data.helpfulCount } : r
        )); 
        return true; 
      }
      return false;
    } catch { 
      return false; 
    }
  }, []);

  const moderateReview = useCallback(async (reviewId: string, isApproved: boolean, adminNote?: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token'); 
      if (!token) return false;
      
      const { data } = await api.patch<ApiSuccessResponse<Review>>(
        `/admin/reviews/${reviewId}/moderate`, 
        { isApproved, adminNote }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data?.status === 'success' && data.data) { 
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, ...data.data } : r)); 
        return true; 
      }
      return false;
    } catch { 
      return false; 
    }
  }, []);

  const findUserReview = useCallback((userId: string): Review | null => 
    reviews.find(r => r.user._id === userId) || null, 
    [reviews]
  );

  return { 
    reviews, 
    stats, 
    pagination, 
    isLoading, 
    error, 
    fetchReviews, 
    createReview, 
    updateReview, 
    deleteReview, 
    markHelpful, 
    moderateReview, 
    findUserReview, 
    clearError: () => setError(null) 
  };
};