import { useState, useCallback } from 'react';
import { api } from '../../api/api';

const STATUS_MAP: Record<string, string> = {
  '6a0d78968c9a243088c4b24b': 'Новый',
  '6a0d78968c9a243088c4b24c': 'В обработке',
  '6a0d78968c9a243088c4b24d': 'Доставлен',
  '6a0d78968c9a243088c4b24e': 'Отменён',
  '6a0d78968c9a243088c4b251': 'Отправлен',

  'new': 'Новый', 'processing': 'В обработке', 'delivered': 'Доставлен', 
  'canceled': 'Отменён', 'cancelled': 'Отменён', 'sent': 'Отправлен'
};

const DELIVERY_MAP: Record<string, string> = {
  pickup: 'Самовывоз', courier: 'Курьер'
};

const PAYMENT_MAP: Record<string, string> = {
  card: 'Картой онлайн', cash: 'Наличными'
};

const translate = (raw: any, map: Record<string, string>): string => {
  if (!raw) return '—';
  const val = typeof raw === 'object' ? raw._id || raw.name : String(raw).trim();
  return map[val] || val;
};

const formatPrice = (n: number) => 
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n || 0);

const formatDate = (d: string) => 
  d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export interface DashboardStats {
  totalOrders: number; totalRevenue: number; totalUsers: number; totalProducts: number;
  pendingOrders: number; lowStockProducts: number; todayOrders: number; todayRevenue: number;
  totalRevenueFormatted: string; todayRevenueFormatted: string;
}

export interface RecentOrder {
  _id: string; user: { login: string; mail?: string }; sum: number; sumFormatted: string;
  status: string; createdAtFormatted: string; deliveryMethod: string; paymentMethod: string;
  payedStatus: string; hasVetMedicine: string; city: string; addressPoint: string;
  products: Array<{ name: string; quantity: number }>;
}

export interface LowStockProduct {
  _id: string; name: string; remains: number; price: number; priceFormatted: string;
}

export interface StatusDistribution {
  statusId: string; statusName: string; count: number;
}

interface ApiSuccessResponse<T> { status: string; data: T; }

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [statusDist, setStatusDist] = useState<StatusDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Требуется авторизация');

      const { data } = await api.get<ApiSuccessResponse<any>>('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data?.status === 'success' && data.data) {
        const raw = data.data;


        const translatedOrders: RecentOrder[] = (raw.recentOrders || []).map((o: any) => ({
          _id: o._id || '',
          user: { login: o.user?.login || '—', mail: o.user?.mail || undefined },
          sum: o.sum || 0,
          sumFormatted: formatPrice(o.sum),
          status: translate(o.status, STATUS_MAP),
          createdAtFormatted: formatDate(o.createdAt),
          deliveryMethod: translate(o.deliveryMethod, DELIVERY_MAP),
          paymentMethod: translate(o.paymentMethod, PAYMENT_MAP),
          payedStatus: o.payed === true ? 'Оплачен' : 'Не оплачен',
          hasVetMedicine: o.hasVetMedicine === true ? 'Да' : 'Нет',
          city: o.city || '—',
          addressPoint: o.adressPoint || o.addressPoint || '—',
          products: (o.products || []).map((p: any) => ({
            name: p.name || p.product?.name || 'Товар',
            quantity: p.quantity || 1
          }))
        }));

        const translatedDist: StatusDistribution[] = (raw.statusDistribution || [])
          .map((item: any) => ({
            statusId: item._id || 'unknown',
            statusName: translate(item._id || item.statusName, STATUS_MAP),
            count: item.count || 0
          }))
          .filter(i => i.statusName !== 'Другой')
          .sort((a, b) => b.count - a.count);

        setStats({
          ...raw.stats,
          totalRevenueFormatted: formatPrice(raw.stats?.totalRevenue),
          todayRevenueFormatted: formatPrice(raw.stats?.todayRevenue)
        });
        setRecentOrders(translatedOrders);
        setLowStock((raw.lowStock || []).map((p: any) => ({
          _id: p._id, name: p.name, remains: p.remains, price: p.price, priceFormatted: formatPrice(p.price)
        })));
        setStatusDist(translatedDist);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Ошибка загрузки дашборда');
      console.error('fetchDashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, recentOrders, lowStock, statusDist, isLoading, error, fetchDashboard };
};