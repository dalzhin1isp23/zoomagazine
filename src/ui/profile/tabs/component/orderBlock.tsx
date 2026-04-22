import React from 'react';
import OrderItemRow from './orderItemRow';
import "../../style/order/orderBlock.css";

export interface OrderBlockProps {
  order: {
    id: string;
    createdAt: string;
    estimatedDelivery: string;
    status: 'delivered' | 'shipping' | 'processing' | string;
    total: string;
    items: Array<{ name: string; quantity: number; image?: string }>;
  };
  onRepeat?: (id: string) => void;
  onDetails?: (id: string) => void;
}

const getStatusColor = (status: string): string => {
  switch(status) {
    case 'delivered': return '#22c55e';
    case 'shipping': return '#f97316';
    case 'processing': return '#3b82f6';
    default: return '#64748b';
  }
};

const getStatusText = (status: string): string => {
  switch(status) {
    case 'delivered': return 'Доставлен';
    case 'shipping': return 'В пути';
    case 'processing': return 'Обрабатывается';
    default: return status;
  }
};

const OrderBlock: React.FC<OrderBlockProps> = ({ order, onRepeat = () => {}, onDetails = () => {} }) => (
  <div className="order-block">
    <div className="order-block-header">
      <div className="order-meta">
        <span className="order-id">#{order.id}</span>
        <div className="order-dates">
          <span>Создан: {order.createdAt}</span>
          <span className="date-separator">•</span>
          <span>Ожидается: {order.estimatedDelivery}</span>
        </div>
      </div>
      <span className="order-status-badge" style={{ color: getStatusColor(order.status) }}>
        {getStatusText(order.status)}
      </span>
    </div>

    <div className="order-items-list">
      {order.items.map((item, idx) => (
        <OrderItemRow key={idx} item={item} />
      ))}
    </div>

    <div className="order-block-footer">
      <span className="order-total">Итого: {order.total}</span>
      <div className="order-block-actions">
        <button className="btn-order-secondary" onClick={() => onDetails(order.id)}>Подробнее</button>
        <button className="btn-order-primary" onClick={() => onRepeat(order.id)}>Повторить</button>
      </div>
    </div>
  </div>
);

export default OrderBlock;