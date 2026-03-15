import React, { useState } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';
import "./style/style.css"

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, title: 'Корм Premium', price: 2500, quantity: 2, img: '🦎' },
    { id: 2, title: 'Террариум малый', price: 4500, quantity: 1, img: '🏠' },
    { id: 3, title: 'Лампа УФ', price: 890, quantity: 1, img: '💡' },
  ]);

  const updateQuantity = (id: number, delta: number): void => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number): void => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total: number = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery: number = total >= 3000 ? 0 : 300;
  const finalTotal: number = total + delivery;

  return (
    <>
      <Header />
      
      <div className="cart-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Корзина</span>
          </div>

          <h1 className="page-title">
            <ShoppingBag size={32} />
            Ваша корзина
          </h1>

          {cartItems.length > 0 ? (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <div style={{fontSize: '60px'}}>{item.img}</div>
                    </div>
                    
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.title}</h3>
                      <p className="cart-item-price">{item.price} ₽</p>
                    </div>

                    <div className="cart-item-quantity">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                    </div>

                    <div className="cart-item-total">{item.price * item.quantity} ₽</div>

                    <button className="remove-btn" onClick={() => removeItem(item.id)}><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3 className="summary-title">Итого</h3>
                
                <div className="summary-row">
                  <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт)</span>
                  <span>{total} ₽</span>
                </div>
                
                <div className="summary-row">
                  <span>Доставка</span>
                  <span>{delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}</span>
                </div>
                
                {delivery > 0 && <div className="summary-note">Бесплатная доставка при заказе от 3000 ₽</div>}
                
                <div className="summary-row total">
                  <span>Итого к оплате</span>
                  <span>{finalTotal} ₽</span>
                </div>

                <button className="checkout-btn">
                  Оформить заказ
                  <ArrowRight size={20} />
                </button>

                <button className="continue-shopping-btn">Продолжить покупки</button>
              </div>
            </div>
          ) : (
            <div className="cart-empty">
              <div style={{fontSize: '100px', marginBottom: '20px'}}>🛒</div>
              <h2>Корзина пуста</h2>
              <p>Добавьте товары, чтобы оформить заказ</p>
              <button className="go-to-catalog-btn">Перейти в каталог</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;