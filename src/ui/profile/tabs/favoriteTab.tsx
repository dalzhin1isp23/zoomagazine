import React from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../../../entity/ProductCards';
import { ProductData } from '../../../function/products/filtration/types';
import "../style/favorite/favorite.css";

const MOCK_WISHLIST: ProductData[] = [
  {
    _id: 'p1',
    name: 'Корм Premium для кошек',
    price: 2500,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
  {
    _id: 'p2',
    name: 'Домик для грызунов',
    price: 1890,
    discount: 10,
    images: [{ url: '', isMain: true }],
  } as ProductData,
];

export interface favoriteTabProps {
  items?: ProductData[];
  onNavigate?: (path: string) => void;
}

const favoriteTab: React.FC<favoriteTabProps> = ({
  items = MOCK_WISHLIST,
  onNavigate = () => {},
}) => {
  if (items.length === 0) {
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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default favoriteTab;