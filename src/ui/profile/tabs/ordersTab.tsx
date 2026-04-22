import React from 'react';
import { Package } from 'lucide-react';
import OrderBlock from './component/orderBlock';
import "../style/order/order.css";

const MOCK_ORDERS = [
  {
    id: 'ORD-2847',
    createdAt: '15.04.2026',
    estimatedDelivery: '18.04.2026',
    total: '3 450 ₽',
    status: 'delivered',
    items: [
      { name: 'Корм Premium для кошек', quantity: 2, image: '' },
      { name: 'Лакомство для котов', quantity: 1, image: '' },
      { name: 'Когтеточка волна', quantity: 1, image: '' },
      { name: 'Наполнитель древесный 10л', quantity: 3, image: '' }
    ]
  },
  {
    id: 'ORD-2831',
    createdAt: '10.04.2026',
    estimatedDelivery: '12.04.2026',
    total: '1 290 ₽',
    status: 'shipping',
    items: [
      { name: 'Домик для грызунов', quantity: 1, image: '' },
      { name: 'Поилка автоматическая', quantity: 1, image: '' }
    ]
  },
  {
    id: 'ORD-2802',
    createdAt: '02.04.2026',
    estimatedDelivery: '05.04.2026',
    total: '5 100 ₽',
    status: 'processing',
    items: [
      { name: 'Аквариум 50л', quantity: 1, image: '' },
      { name: 'Фильтр внешний', quantity: 1, image: '' },
      { name: 'Грунт декоративный 2кг', quantity: 2, image: '' }
    ]
  }
];

export interface OrdersTabProps {
  orders?: typeof MOCK_ORDERS;
  onRepeatOrder?: (id: string) => void;
  onNavigate?: (path: string) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ 
  orders = MOCK_ORDERS,
  onRepeatOrder = () => {},
  onNavigate = () => {},
}) => {
  if (orders.length === 0) {
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
            key={order.id} 
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