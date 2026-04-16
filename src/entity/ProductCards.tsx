import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductData } from '../../function/products/filtration/types';
import "./style/ProductCards.css";

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '';
  
  const discountedPrice = product.discount && product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : null;

  return (
    <Link to={`/product/${product._id}`} className="modern-offer-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      {product.discount && product.discount > 0 && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      
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
        <img src={mainImage} alt={product.name} />
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
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;