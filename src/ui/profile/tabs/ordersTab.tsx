import React from 'react';
import { Package } from 'lucide-react';
import OrderBlock from './component/orderBlock';
import "../style/order/order.css";

const API_BASE_URL = 'http://127.0.0.1:3000';

export interface BackendOrder {
  _id: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      price?: number;
      images?: Array<{ url: string; isMain?: boolean }>;
      remains?: number;
      isVetMedicine?: boolean;
    };
    quantity: number;
    price: number;
    name: string;
  }>;
  sum: number;
  adressPoint: string;
  city?: string;
  deliveryMethod?: 'courier' | 'pickup';
  paymentMethod?: 'card' | 'cash';
  status: { _id: string; name: string } | string;
  createdAt: string;
  updatedAt: string;
  hasVetMedicine?: boolean;
  vetDocuments?: Array<{ url: string; filename: string; uploadedAt: string }>;
}

export interface OrderBlockData {
  id: string;
  createdAt: string;
  estimatedDelivery: string;
  status: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    image?: string;
    price?: number;
    productId: string;
    remains?: number;
    isVetMedicine?: boolean;
  }>;
  adressPoint: string;
  city?: string;
  deliveryMethod?: 'courier' | 'pickup';
  paymentMethod?: 'card' | 'cash';
  hasVetMedicine?: boolean;
  vetDocuments?: Array<{ url: string; filename: string }>;
}

export interface OrdersTabProps {
  orders?: BackendOrder[];
  onRepeatOrder?: (order: BackendOrder) => void;
  onNavigate?: (path: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const calculateEstimatedDelivery = (createdAt: string, deliveryMethod: string): string => {
  const date = new Date(createdAt);
  const daysToAdd = deliveryMethod === 'pickup' ? 0 : 3;
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getMainImage = (images?: Array<{ url: string; isMain?: boolean }>): string | undefined => {
  if (!images || images.length === 0) return undefined;
  const main = images.find(img => img.isMain) || images[0];
  if (main.url.startsWith('http')) return main.url;
  return `${API_BASE_URL}${main.url}`;
};

const transformOrder = (order: BackendOrder): OrderBlockData => {
  const statusName = typeof order.status === 'string' ? order.status : order.status?.name || 'Новый';
  
  return {
    id: order._id,
    createdAt: formatDate(order.createdAt),
    estimatedDelivery: calculateEstimatedDelivery(order.createdAt, order.deliveryMethod || 'courier'),
    status: statusName,
    total: `${order.sum} ₽`,
    adressPoint: order.adressPoint,
    city: order.city,
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    hasVetMedicine: order.hasVetMedicine,
    vetDocuments: order.vetDocuments,
    items: order.products.map(p => ({
      name: p.name || p.product?.name || 'Товар',
      quantity: p.quantity,
      price: p.price,
      image: getMainImage(p.product?.images),
      productId: p.product?._id || '',
      remains: p.product?.remains,
      isVetMedicine: p.product?.isVetMedicine
    }))
  };
};

const OrdersTab: React.FC<OrdersTabProps> = ({ 
  orders = [],
  onRepeatOrder = () => {},
  onNavigate = () => {},
}) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="tab-content">
        <h1 className="page-title">Мои заказы</h1>
        <div className="order-empty-state">
          <Package size={48} />
          <p>У вас пока нет заказов</p>
          <button onClick={() => onNavigate('/catalog')}>Перейти в каталог</button>
        </div>
      </div>
    );
  }

  const transformedOrders = orders.map(transformOrder);

  const handleRepeat = (originalOrder: BackendOrder) => {
    onRepeatOrder(originalOrder);
  };

  return (
    <div className="tab-content">
      <h1 className="page-title">Мои заказы</h1>
      <div className="orders-list">
        {transformedOrders.map(order => (
          <OrderBlock 
            key={order.id} 
            order={order} 
            onRepeat={() => {
              const original = orders.find(o => o._id === order.id);
              if (original) handleRepeat(original);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;