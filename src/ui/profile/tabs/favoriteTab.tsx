import React from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../../../entity/ProductCards';
import { ProductData } from '../../../function/products/filtration/types';
import "../style/favorite/favorite.css";

export interface favoriteTabProps {
  items?: ProductData[];
  onNavigate?: (path: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const favoriteTab: React.FC<favoriteTabProps> = ({
  items = [],
  onNavigate = () => {},
  onToggleFavorite = () => {},
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="tab-content">
        <h1 className="page-title">Избранное</h1>
        <div className="empty-state">
          <Heart size={48} />
          <p>Список избранного пуст</p>
          <button onClick={() => onNavigate('/catalog')}>
            Перейти к товарам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h1 className="page-title">Избранное</h1>
      <div className="wishlist-grid">
        {items.map(product => (
          <ProductCard 
            key={product._id} 
            product={product}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default favoriteTab;