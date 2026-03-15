import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import "./style/ProductCards.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="modern-offer-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      {product.discount && <div className="discount-badge">{product.discount}</div>}
      
      <button 
        className="wishlist-btn-top"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Heart size={24} fill="white" color="white" strokeWidth={1.5} />
      </button>

      <div className="offer-img-container">
        <img src={product.img} alt={product.title} />
      </div>

      <div className="offer-info-bottom">
        <h3 className="offer-title-white">{product.title}</h3>
        
        <div className="price-container-white">
          <div>
            {product.oldPrice && <span className="old-price">{product.oldPrice}₽</span>}
            <span className="current-price">{product.price}₽</span>
          </div>
          <button 
            className="cart-btn-small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;