import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductData } from '../function/products/filtration/types';
import "./style/ProductCards.css";

const API_BASE_URL = 'http://127.0.0.1:3000';

interface ProductCardProps {
  product: ProductData;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onToggleFavorite,
  isFavorite = false 
}) => {
  const getImageUrl = (url?: string) => {
    if (!url) return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url;
  
  const discountedPrice = product.discount && product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product._id);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="modern-offer-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      {product.discount && product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      
      <button 
        className={`wishlist-btn-top ${isFavorite ? 'active' : ''}`}
        onClick={handleWishlistClick}
        title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        type="button"
      >
        <Heart 
          size={24} 
          fill={isFavorite ? '#ef4444' : 'white'} 
          color={isFavorite ? '#ef4444' : 'white'} 
          strokeWidth={1.5} 
        />
      </button>

      <div className="offer-img-container">
        <img 
          src={getImageUrl(mainImage)} 
          alt={product.name}
          className="offer-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${API_BASE_URL}/uploads/products/placeholder.jpg`;
          }}
        />
      </div>

      <div className="offer-info-bottom">
        <h3 className="offer-title-white">{product.name}</h3>
        
        <div className="price-container-white">
          <div>
            {discountedPrice && (
              <span className="old-price">{product.price}₽</span>
            )}
            <span className="current-price">{discountedPrice || product.price}₽</span>
          </div>
          <button 
            className="cart-btn-small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            type="button"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;