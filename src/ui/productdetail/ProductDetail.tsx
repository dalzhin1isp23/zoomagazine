import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import ProductCard from '../../entity/ProductCards';
import { Heart, ShoppingCart, Share2, Star, ArrowLeft } from 'lucide-react';
import { useProductDetails } from '../../function/products/useProductDetails';
import { useProducts } from '../../function/products/useProducts';
import "./style/style.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const { 
    product, 
    isLoading, 
    error, 
    refetch 
  } = useProductDetails(id);

  const { products: relatedProducts } = useProducts({
    initialLimit: 4,
    autoFetch: false,
  });

  useEffect(() => {
    if (product?.category) {
    }
  }, [product]);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} x ${product?.title} to cart`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="container">
            <div className="loading-placeholder">Загрузка товара...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="container">
            <button onClick={() => navigate(-1)} className="back-btn">
              <ArrowLeft size={16} /> Назад
            </button>
            <div className="error-banner" role="alert">
              {error || 'Товар не найден'}
              <button onClick={() => id && refetch()} className="retry-btn">
                Повторить
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="product-detail-page">
        <div className="container">
          <div className="breadcrumbs">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span> 
            <span> / </span> 
            <span onClick={() => navigate('/catalog')} className="breadcrumb-link">Каталог</span> 
            <span> / </span> 
            <span>{product.name}</span>
          </div>

          <div className="product-detail-content">
            <div className="product-gallery">
              <div className="main-image">
                {product.images?.[0]?.url ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.images[0].altText || product.name}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ) : (
                  <div style={{fontSize: '200px', textAlign: 'center'}}>🦎</div>
                )}
              </div>
              <div className="thumbnail-images">
                {product.images?.map((img, i: number) => (
                  <div 
                    key={img._id || i} 
                    className={`thumbnail ${i === 0 ? 'active' : ''}`}
                    onClick={() => {}}
                  >
                    {img.url ? (
                      <img 
                        src={img.url} 
                        alt={img.altText || ''}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{fontSize: '40px'}}>🦎</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info-section">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i: number) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < Math.floor(product.rating || 0) ? '#fbbf24' : 'none'} 
                        color={i < Math.floor(product.rating || 0) ? '#fbbf24' : '#cbd5e1'} 
                      />
                    ))}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews || 0} отзывов)
                  </span>
                </div>
              </div>

              <div className="product-price-section">
                <span className="current-price">{product.price} ₽</span>
                {product.oldPrice && <span className="old-price">{product.oldPrice} ₽</span>}
                {product.discount && <span className="discount-badge">-{product.discount}%</span>}
              </div>

              <p className="product-description">{product.description}</p>

              {product.features && product.features.length > 0 && (
                <div className="product-features">
                  {product.features.map((feature: string, i: number) => (
                    <div key={i} className="feature-item">✓ {feature}</div>
                  ))}
                </div>
              )}

              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isLoading}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isLoading}
                  >
                    +
                  </button>
                </div>

                <button 
                  className="add-to-cart-btn-large" 
                  onClick={handleAddToCart}
                  disabled={isLoading || !product.inStock}
                >
                  <ShoppingCart size={20} />
                  {product.remains > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>

                <button 
                  className={`wishlist-btn-large ${isWishlisted ? 'active' : ''}`} 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  disabled={isLoading}
                >
                  <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
                </button>

                <button className="share-btn" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}>
                  <Share2 size={20} />
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Артикул:</span>
                  <span className="meta-value">{product._id || 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span className="meta-value">{product.category?.name || '—'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Тип:</span>
                  <span className="meta-value">{product.type?.name || '—'}</span>
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
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} 
                onClick={() => setActiveTab('description')}
              >
                Описание
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
                onClick={() => setActiveTab('reviews')}
              >
                Отзывы ({product.reviews || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`} 
                onClick={() => setActiveTab('delivery')}
              >
                Доставка
              </button>
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
                    <p className="review-text">Отличный товар! Питомец в восторге.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'delivery' && (
                <div className="tab-content">
                  <h3>Информация о доставке</h3>
                  <p>Бесплатная доставка при заказе от 3000 ₽</p>
                  <p>Срок доставки: 1-3 рабочих дня</p>
                  <p>Самовывоз из пунктов выдачи</p>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h2 className="section-title">Похожие товары</h2>
              <div className="products-grid grid">
                {relatedProducts.map(p => (
                  <ProductCard 
                    key={p._id} 
                    product={p} 
                    viewMode="grid"
                    onClick={() => navigate(`/product/${p._id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;