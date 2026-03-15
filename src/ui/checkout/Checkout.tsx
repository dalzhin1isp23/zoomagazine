import React, { useState, ChangeEvent } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';
import { UserProfile, CheckoutStep, PaymentMethod, DeliveryMethod } from '../../types';
import "./style/style.css"

const Checkout: React.FC = () => {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('courier');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      
      <div className="checkout-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Корзина</span> / <span>Оформление заказа</span>
          </div>

          <h1 className="page-title">Оформление заказа</h1>

          <div className="checkout-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Контакты</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Доставка</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Оплата</span>
            </div>
          </div>

          <div className="checkout-content">
            <div className="checkout-form">
              {step === 1 && (
                <div className="form-section">
                  <h2 className="section-title"><User size={24} /> Контактная информация</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Имя</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Иван" />
                    </div>
                    <div className="form-group">
                      <label>Фамилия</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Иванов" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label><Mail size={16} /> Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.ru" />
                  </div>

                  <div className="form-group">
                    <label><Phone size={16} /> Телефон</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (999) 000-00-00" />
                  </div>

                  <button className="next-btn" onClick={() => setStep(2)}>Далее</button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <h2 className="section-title"><MapPin size={24} /> Адрес доставки</h2>
                  
                  <div className="form-group">
                    <label>Город</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Москва" />
                  </div>

                  <div className="form-group">
                    <label>Адрес</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Улица, дом, квартира" />
                  </div>

                  <div className="delivery-options">
                    <label className="delivery-option">
                      <input type="radio" name="delivery" value="courier" checked={deliveryMethod === 'courier'} onChange={() => setDeliveryMethod('courier')} />
                      <span>Курьером (1-3 дня)</span>
                    </label>
                    <label className="delivery-option">
                      <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
                      <span>Самовывоз (бесплатно)</span>
                    </label>
                  </div>

                  <div className="form-navigation">
                    <button className="back-btn" onClick={() => setStep(1)}>Назад</button>
                    <button className="next-btn" onClick={() => setStep(3)}>Далее</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-section">
                  <h2 className="section-title"><CreditCard size={24} /> Оплата</h2>
                  
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-option-content">
                        <CreditCard size={24} />
                        <span>Банковской картой</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                      <div className="payment-option-content">
                        <span>💵</span>
                        <span>Наличными при получении</span>
                      </div>
                    </label>
                  </div>

                  <div className="order-summary-mini">
                    <h3>Ваш заказ</h3>
                    <div className="summary-row"><span>Товары</span><span>3 840 ₽</span></div>
                    <div className="summary-row"><span>Доставка</span><span>Бесплатно</span></div>
                    <div className="summary-row total"><span>Итого</span><span>3 840 ₽</span></div>
                  </div>

                  <div className="form-navigation">
                    <button className="back-btn" onClick={() => setStep(2)}>Назад</button>
                    <button className="confirm-btn"><CheckCircle size={20} /> Подтвердить заказ</button>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-sidebar">
              <h3 className="sidebar-title">Ваш заказ</h3>
              
              <div className="order-items">
                <div className="order-item">
                  <div style={{fontSize: '40px'}}>🦎</div>
                  <div>
                    <p className="item-name">Корм Premium</p>
                    <p className="item-qty">2 шт × 2 500 ₽</p>
                  </div>
                  <span className="item-total">5 000 ₽</span>
                </div>
              </div>

              <div className="promo-code">
                <input type="text" placeholder="Промокод" />
                <button>Применить</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;