import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api'; 

export interface UserData {
  id: string;
  mail?: string;
  phone?: string;
  role: string;
  status?: string;
}

interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: UserData;
    token: string;
  };
}

export interface UseAuthReturn {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string, mail?: string, phone?: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const handleRequest = useCallback(async (
    endpoint: string,
    body: Record<string, unknown>,
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<AuthResponse> => {
    const response = await api({
      method,
      url: `/auth${endpoint}`,  
      data: method === 'POST' || method === 'PUT' ? body : undefined,
    });
    return response.data;
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleRequest('/login', { login: loginValue, password });
      
      const newToken = response.data.token;
      const newUser = {
        ...response.data.user,
        role: String(response.data.user.role)
      };
      
      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      navigate('/profile');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка входа';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [handleRequest, navigate]);

  const register = useCallback(async (loginValue: string, password: string, mail?: string, phone?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await handleRequest('/register', { 
        login: loginValue, 
        password, 
        mail, 
        phone 
      });
      
      const newToken = response.data.token;
      const newUser = {
        ...response.data.user,
        role: String(response.data.user.role)
      };
      
      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      navigate('/profile');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка регистрации';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [handleRequest, navigate]);

  const fetchUserProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('auth_token');
    if (!currentToken) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await api.get<AuthResponse>('/auth/me');
      if (data.status === 'success') {
        const updatedUser = {
          ...data.data.user,
          role: String(data.data.user.role)
        };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
        navigate('/login');
        return;
      }
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки профиля');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUserProfile,
    isAuthenticated: !!token && !!user
  };
};

export default useAuth;