import React from 'react';
import { Package } from 'lucide-react';
import OrderBlock from './component/orderBlock';
import "../style/order/order.css";

export interface OrderItem {
  _id: string;
  products: Array<{ product: { _id: string; name: string; images?: Array<{ url: string; isMain: boolean }> }; quantity: number }>;
  sum: number;
  adressPoint: string;
  status: { name: string };
  createdAt: string;
}

export interface OrdersTabProps {
  orders?: OrderItem[];
  onRepeatOrder?: (id: string) => void;
  onNavigate?: (path: string) => void;
}

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
          <button onClick={() => onNavigate('/catalog')}>
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h1 className="page-title">Мои заказы</h1>
      <div className="orders-list">
        {orders.map(order => (
          <OrderBlock 
            key={order._id} 
            order={order} 
            onRepeat={onRepeatOrder}
            onDetails={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;