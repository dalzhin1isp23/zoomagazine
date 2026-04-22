import React from 'react';
import { Package } from 'lucide-react';
import "../../style/order/orderItemsBlock.css";

export interface OrderItemRowProps {
  item: {
    name: string;
    quantity: number;
    image?: string;
  };
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => (
  <div className="order-item-row">
    <div className="order-item-image">
      {item.image ? (
        <img src={item.image} alt={item.name} />
      ) : (
        <Package size={20} />
      )}
    </div>
    <div className="order-item-info">
      <span className="order-item-name">{item.name}</span>
    </div>
    <div className="order-item-qty">x{item.quantity}</div>
  </div>
);

export default OrderItemRow;