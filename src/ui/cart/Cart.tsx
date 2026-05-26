import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../function/profile/useCart';
import "./style/style.css";

const API_BASE_URL = 'http://127.0.0.1:3000';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isLoading, 
    error, 
    updateQuantity, 
    removeItem, 
    clearCart,
    totals,
    syncStock 
  } = useCart();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      setIsSyncing(true);
      syncStock().finally(() => setIsSyncing(false));
    }
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getMainImage = (product: any) => {
    const main = product.images?.find((img: any) => img.isMain);
    return main?.url || product.images?.[0]?.url;
  };

  const getPrice = (product: any) => {
    if (product.discount && product.discount > 0) {
      return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="cart-page">
          <div className="container">
            <div className="loading-placeholder">Загрузка корзины...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { subtotal, delivery, total, totalItems } = totals();

  return (
    <>
      <Header />
      
      <div className="cart-page">
        <div className="container">
          <div className="breadcrumbs">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span> 
            <span> / </span> 
            <span>Корзина</span>
          </div>

          <h1 className="page-title">
            <ShoppingBag size={32} />
            Ваша корзина {totalItems > 0 && `(${totalItems} шт)`}
          </h1>

          {error && (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {isSyncing && items.length > 0 && (
            <div className="info-banner">Проверка наличия товаров...</div>
          )}

          {items.length > 0 ? (
            <div className="cart-content">
              <div className="cart-items">
                {items.map(item => {
                  const currentPrice = getPrice(item.product);
                  const available = item.product.remains ?? 0;
                  const isOverStock = item.quantity > available;

                  return (
                    <div key={item.product._id} className={`cart-item ${isOverStock ? 'out-of-stock' : ''}`}>
                      <div className="cart-item-image">
                        <img 
                          src={getImageUrl(getMainImage(item.product))} 
                          alt={item.product.name}
                          className="cart-item-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${API_BASE_URL}/uploads/products/placeholder.jpg`;
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-info">
                        <h3 
                          className="cart-item-name"
                          onClick={() => navigate(`/product/${item.product._id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {item.product.name}
                        </h3>
                        {item.product.category?.name && (
                          <p className="cart-item-category">{item.product.category.name}</p>
                        )}
                        <div className="cart-item-price">
                          {item.product.discount && item.product.discount > 0 && (
                            <span className="old-price">{item.product.price} ₽</span>
                          )}
                          <span className="current-price">{currentPrice} ₽</span>
                          {item.product.discount && item.product.discount > 0 && (
                            <span className="discount-badge">-{item.product.discount}%</span>
                          )}
                        </div>
                        {available <= 5 && available > 0 && (
                          <p className="stock-warning">Осталось: {available} шт</p>
                        )}
                        {available === 0 && (
                          <p className="out-of-stock-label">Нет в наличии</p>
                        )}
                      </div>

                      <div className="cart-item-quantity">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= available}
                          title={available <= item.quantity ? `Доступно только ${available} шт` : ''}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="cart-item-total">
                        {currentPrice * item.quantity} ₽
                      </div>

                      <button 
                        className="remove-btn" 
                        onClick={() => removeItem(item.product._id)}
                        title="Удалить из корзины"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <h3 className="summary-title">Итого</h3>
                
                <div className="summary-row">
                  <span>Товары ({totalItems} шт)</span>
                  <span>{subtotal} ₽</span>
                </div>
                
                <div className="summary-row">
                  <span>Доставка</span>
                  <span>{delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}</span>
                </div>
                
                {delivery > 0 && (
                  <div className="summary-note">
                    Бесплатная доставка при заказе от 3000 ₽
                  </div>
                )}
                
                <div className="summary-row total">
                  <span>Итого к оплате</span>
                  <span>{total} ₽</span>
                </div>

                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={items.some(i => (i.product.remains ?? 0) === 0)}
                >
                  Оформить заказ
                  <ArrowRight size={20} />
                </button>

                <button 
                  className="continue-shopping-btn" 
                  onClick={() => {
                    if (window.confirm('Очистить корзину?')) clearCart();
                  }}
                >
                  Очистить корзину
                </button>

                <button 
                  className="continue-shopping-btn" 
                  onClick={() => navigate('/catalog')}
                >
                  Продолжить покупки
                </button>
              </div>
            </div>
          ) : (
            <div className="cart-empty">
              <div style={{fontSize: '100px', marginBottom: '20px'}}><ShoppingCart/></div>
              <h2>Корзина пуста</h2>
              <p>Добавьте товары, чтобы оформить заказ</p>
              <button className="go-to-catalog-btn" onClick={() => navigate('/catalog')}>
                Перейти в каталог
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;