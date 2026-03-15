import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="modern-offer-card">
      {/* Скидка теперь вне контейнера картинки */}
      <div className="discount-badge">{product.discount}</div>
      
      {/* Сердце привязано к углу всей карточки */}
      <button className="wishlist-btn-top">
          <Heart size={24} fill="white" color="white" strokeWidth={1.5} />
      </button>

      <div className="offer-img-container">
        <img src={product.img} alt={product.title} />
      </div>

      <div className="offer-info-bottom">
        <h3 className="offer-title-white">{product.title}</h3>
        
        <div className="price-container-white">
          <div>
            <span className="old-price">{product.oldPrice}₽</span>
            <span className="current-price">{product.price}₽</span>
          </div>
          <button className="cart-btn-small">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;