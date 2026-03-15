import React, { useState } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { Product } from '../../types';
import "./style/style.css"

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const product: Product = {
    id: 1,
    title: 'Корм Premium для рептилий',
    price: 2500,
    oldPrice: 3200,
    discount: '-22%',
    rating: 4.8,
    reviews: 124,
    description: 'Полнорационный корм для взрослых рептилий. Содержит натуральные ингредиенты, витамины и минералы. Подходит для ящериц, гекконов и агам.',
    features: ['Натуральные ингредиенты', 'Без ГМО', 'Богат витаминами', 'Для всех видов'],
    images: ['🦎', '🦎', '🦎', '🦎']
  };

  return (
    <>
      <Header />
      
      <div className="product-detail-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Каталог</span> / <span>{product.title}</span>
          </div>

          <div className="product-detail-content">
            <div className="product-gallery">
              <div className="main-image">
                <div style={{fontSize: '200px', textAlign: 'center'}}>{product.images?.[0]}</div>
              </div>
              <div className="thumbnail-images">
                {product.images?.map((img: string, i: number) => (
                  <div key={i} className={`thumbnail ${i === 0 ? 'active' : ''}`}>
                    <div style={{fontSize: '40px'}}>{img}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.title}</h1>
                
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i: number) => (
                      <Star key={i} size={18} fill={i < Math.floor(product.rating || 0) ? '#fbbf24' : 'none'} color={i < Math.floor(product.rating || 0) ? '#fbbf24' : '#cbd5e1'} />
                    ))}
                  </div>
                  <span className="rating-text">{product.rating} ({product.reviews} отзывов)</span>
                </div>
              </div>

              <div className="product-price-section">
                <span className="current-price">{product.price} ₽</span>
                {product.oldPrice && <span className="old-price">{product.oldPrice} ₽</span>}
                {product.discount && <span className="discount-badge">{product.discount}</span>}
              </div>

              <p className="product-description">{product.description}</p>

              <div className="product-features">
                {product.features?.map((feature: string, i: number) => (
                  <div key={i} className="feature-item">✓ {feature}</div>
                ))}
              </div>

              <div className="product-actions">
                <div className="quantity-selector">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button className="add-to-cart-btn-large">
                  <ShoppingCart size={20} />
                  Добавить в корзину
                </button>

                <button className={`wishlist-btn-large ${isWishlisted ? 'active' : ''}`} onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>

                <button className="share-btn">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Артикул:</span>
                  <span className="meta-value">ART-001</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span className="meta-value">Корма</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Доставка:</span>
                  <span className="meta-value">1-3 дня</span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-tabs">
            <div className="tabs-header">
              <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Описание</button>
              <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Отзывы ({product.reviews})</button>
              <button className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => setActiveTab('delivery')}>Доставка</button>
            </div>

            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-content">
                  <h3>Подробное описание</h3>
                  <p>{product.description}</p>
                  <p>Дополнительная информация о составе, способе применения и хранении товара.</p>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="tab-content">
                  <h3>Отзывы покупателей</h3>
                  <div className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">Анна К.</span>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <p className="review-text">Отличный корм! Питомец ест с удовольствием.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'delivery' && (
                <div className="tab-content">
                  <h3>Информация о доставке</h3>
                  <p>Бесплатная доставка при заказе от 3000 ₽</p>
                  <p>Срок доставки: 1-3 рабочих дня</p>
                  <p>Самовывоз из магазинов сети</p>
                </div>
              )}
            </div>
          </div>

          <div className="related-products">
            <h2 className="section-title">Похожие товары</h2>
            <div className="products-grid grid">
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;