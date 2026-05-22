import React from 'react';
import OrderItemRow from './orderItemRow';
import "../../style/order/orderBlock.css";

export interface OrderBlockProps {
  order: {
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
    }>;
    adressPoint: string;
    deliveryMethod?: string;
    paymentMethod?: string;
    hasVetMedicine?: boolean;
    vetDocuments?: Array<{ url: string; filename: string }>;
  };
  onRepeat?: (id: string) => void;
}

const getStatusColor = (status: string): string => {
  const lower = status.toLowerCase();
  if (lower.includes('доставлен') || lower === 'delivered') return '#22c55e';
  if (lower.includes('отправлен') || lower.includes('в пути') || lower === 'shipping') return '#f97316';
  if (lower.includes('обрабат') || lower === 'processing') return '#3b82f6';
  if (lower.includes('отмен') || lower === 'cancelled') return '#ef4444';
  return '#64748b';
};

const getStatusText = (status: string): string => {
  const lower = status.toLowerCase();
  if (lower.includes('доставлен')) return 'Доставлен';
  if (lower.includes('отправлен') || lower.includes('в пути')) return 'В пути';
  if (lower.includes('обрабат')) return 'Обрабатывается';
  if (lower.includes('нов') || lower === 'new') return 'Новый';
  if (lower.includes('отмен')) return 'Отменён';
  return status;
};

const OrderBlock: React.FC<OrderBlockProps> = ({ order, onRepeat = () => {} }) => (
  <div className="order-block">
    <div className="order-block-header">
      <div className="order-meta">
        <span className="order-id">#{order.id.slice(-8)}</span>
        <div className="order-dates">
          <span>Создан: {order.createdAt}</span>
          <span className="date-separator">•</span>
          <span>Ожидается: {order.estimatedDelivery}</span>
        </div>
      </div>
      <span className="order-status-badge" style={{ color: getStatusColor(order.status), borderColor: getStatusColor(order.status) }}>
        {getStatusText(order.status)}
      </span>
    </div>

    <div className="order-items-list">
      {order.items.map((item, idx) => (
        <OrderItemRow key={idx} item={item} />
      ))}
    </div>

    {order.hasVetMedicine && order.vetDocuments && order.vetDocuments.length > 0 && (
      <div className="order-vet-info">
        <span className="vet-badge"> Ветпрепараты</span>
        <span className="vet-docs-count">Документов: {order.vetDocuments.length}</span>
      </div>
    )}

    <div className="order-block-footer">
      <div className="order-footer-left">
        <span className="order-total">Итого: {order.total}</span>
        <span className="order-address">{order.adressPoint}</span>
        {(order.deliveryMethod || order.paymentMethod) && (
          <span className="order-delivery-payment">
            {order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Курьер'} • {order.paymentMethod === 'cash' ? 'Наличные' : 'Карта'}
          </span>
        )}
      </div>
      <div className="order-block-actions">
        <button className="btn-order-primary" onClick={() => onRepeat(order.id)}>Повторить</button>
      </div>
    </div>
  </div>
);

export default OrderBlock;