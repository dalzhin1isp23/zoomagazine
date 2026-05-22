import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle, Upload, X, AlertCircle } from 'lucide-react';
import { useCart } from '../../function/profile/useCart';
import { api } from '../../api/api';
import "./style/Checkoutstyle.css";

const API_BASE_URL = 'http://127.0.0.1:3000';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    remains: number;
    isVetMedicine?: boolean;
    images?: Array<{ url: string; isMain?: boolean }>;
  };
  quantity: number;
}

interface RepeatOrderData {
  items: CartItem[];
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  deliveryMethod: 'courier' | 'pickup';
  paymentMethod: 'card' | 'cash';
  hasVetMedicine: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, clearCart, totals, isLoading: cartLoading, addToCart } = useCart();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  
  const [hasVetMedicine, setHasVetMedicine] = useState(false);
  const [vetDocs, setVetDocs] = useState<File[]>([]);
  const [vetDocPreviews, setVetDocPreviews] = useState<string[]>([]);
  const [vetDocError, setVetDocError] = useState<string | null>(null);
  const vetFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    const loadProfileData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const { data } = await api.get('/profile');
        if (data?.data) {
          setFormData(prev => ({
            ...prev,
            email: data.data.mail || prev.email,
            phone: data.data.phone || prev.phone
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfileData();
  }, [navigate, token]);

  useEffect(() => {
    const state = location.state as RepeatOrderData | undefined;
    
    if (state?.repeatOrder && state.items?.length > 0) {

      const addItemsToCart = async () => {
        for (const item of state.items) {
          await addToCart(item.product._id, item.quantity, item.product);
        }
      };
      addItemsToCart();

      if (state.formData) {
        setFormData(prev => ({ ...prev, ...state.formData }));
      }
      if (state.deliveryMethod) setDeliveryMethod(state.deliveryMethod);
      if (state.paymentMethod) setPaymentMethod(state.paymentMethod);
      if (state.hasVetMedicine !== undefined) setHasVetMedicine(state.hasVetMedicine);

      setStep(3);
    }
  }, [location.state, addToCart]);

  useEffect(() => {
    const hasVet = cartItems.some(item => item.product.isVetMedicine === true);
    setHasVetMedicine(hasVet);
    if (!hasVet) {
      setVetDocs([]);
      setVetDocPreviews([]);
      setVetDocError(null);
    }
  }, [cartItems]);

  useEffect(() => {
    const state = location.state as RepeatOrderData | undefined;
    if (!state?.repeatOrder && !cartLoading && cartItems.length === 0 && !isSubmitting) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSubmitting, cartLoading, location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVetDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type) &&
      file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setVetDocError('Разрешены только изображения JPG, PNG, WebP до 5 МБ');
      return;
    }

    setVetDocs(prev => [...prev, ...validFiles]);
    setVetDocPreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
    setVetDocError(null);

    if (vetFileInputRef.current) {
      vetFileInputRef.current.value = '';
    }
  };

  const removeVetDoc = (index: number) => {
    setVetDocs(prev => prev.filter((_, i) => i !== index));
    setVetDocPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getPrice = (product: CartItem['product']) => {
    if (product.discount && product.discount > 0) {
      return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
  };

  const { subtotal } = totals();
  const deliveryCost = deliveryMethod === 'pickup' ? 0 : (subtotal >= 3000 ? 0 : 300);
  const total = subtotal + deliveryCost;

  const handleSubmit = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setSubmitError('Заполните все обязательные поля');
        return;
      }
      setStep(2);
      setSubmitError(null);
      return;
    }

    if (step === 2) {
      if (!formData.address || !formData.city) {
        setSubmitError('Укажите город и адрес доставки');
        return;
      }
      
      if (hasVetMedicine && vetDocs.length === 0) {
        setVetDocError('Для ветеринарных препаратов необходимо загрузить фото документа');
        return;
      }
      
      setStep(3);
      setSubmitError(null);
      setVetDocError(null);
      return;
    }

    if (step === 3) {
      if (hasVetMedicine && vetDocs.length === 0) {
        setVetDocError('Для ветеринарных препаратов необходимо загрузить документ');
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const orderPayload = {
          products: cartItems.map(item => ({
            product: String(item.product._id),
            quantity: Number(item.quantity),
            price: Number(getPrice(item.product)),
            name: String(item.product.name)
          })),
          sum: Number(total),
          adressPoint: String(deliveryMethod === 'pickup' 
            ? `Пункт выдачи: ${formData.city}` 
            : `${formData.city}, ${formData.address}`),
          city: String(formData.city || ''),
          deliveryMethod: String(deliveryMethod),
          paymentMethod: String(paymentMethod)
        };

        const { data: orderData } = await api.post('/orders', orderPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const orderId = orderData.data._id;

        if (hasVetMedicine && vetDocs.length > 0) {
          for (const file of vetDocs) {
            const uploadFormData = new FormData();
            uploadFormData.append('document', file);
            await api.post(`/orders/${orderId}/vet-document`, uploadFormData);
          }
        }

        clearCart();
        navigate('/profile', { state: { orderSuccess: true, orderId } });
        
      } catch (err: any) {
        console.error('Order error:', err);
        const backendMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
        setSubmitError(backendMessage || 'Не удалось оформить заказ');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (cartLoading) {
    return (
      <>
        <Header />
        <div className="checkout-page">
          <div className="container">
            <div className="loading-placeholder">Загрузка корзины...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="checkout-page">
        <div className="container">
          <div className="breadcrumbs">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span> / 
            <span onClick={() => navigate('/cart')} className="breadcrumb-link">Корзина</span> / 
            <span>Оформление заказа</span>
          </div>

          <h1 className="page-title">Оформление заказа</h1>

          {!location.state?.repeatOrder && (
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
          )}

          <div className="checkout-content">
            <div className="checkout-form">
              {step === 1 && (
                <div className="form-section">
                  <h2 className="section-title"><User size={24} /> Контактная информация</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Имя *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Иван" required />
                    </div>
                    <div className="form-group">
                      <label>Фамилия *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Иванов" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label><Mail size={16} /> Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.ru" required />
                  </div>

                  <div className="form-group">
                    <label><Phone size={16} /> Телефон *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (999) 000-00-00" required />
                  </div>

                  {submitError && <div className="form-error">{submitError}</div>}
                  <button className="next-btn" onClick={handleSubmit} disabled={isSubmitting}>Далее</button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <h2 className="section-title"><MapPin size={24} /> Адрес доставки</h2>
                  
                  <div className="form-group">
                    <label>Город *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Москва" required />
                  </div>

                  <div className="form-group">
                    <label>Адрес *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Улица, дом, квартира" required />
                  </div>

                  <div className="delivery-options">
                    <label className="delivery-option">
                      <input type="radio" name="delivery" value="courier" checked={deliveryMethod === 'courier'} onChange={() => setDeliveryMethod('courier')} />
                      <span>Курьером (1-3 дня) {subtotal < 3000 && <span className="delivery-price">+300 ₽</span>}</span>
                    </label>
                    <label className="delivery-option">
                      <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
                      <span>Самовывоз <span className="delivery-free">бесплатно</span></span>
                    </label>
                  </div>

                  {hasVetMedicine && (
                    <div className={`vet-doc-section ${vetDocError ? 'has-error' : ''}`}>
                      <h4><AlertCircle size={18} /> Ветеринарные препараты в заказе</h4>
                      <p className="hint">Загрузите фото рецепта или документа от врача</p>
                      
                      <div className="vet-doc-upload">
                        <button type="button" className="upload-btn" onClick={() => vetFileInputRef.current?.click()}>
                          <Upload size={16} /> Загрузить фото
                        </button>
                        <input ref={vetFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleVetDocChange} style={{ display: 'none' }} multiple />
                      </div>

                      {vetDocError && <div className="form-error">{vetDocError}</div>}

                      {vetDocPreviews.length > 0 && (
                        <div className="vet-doc-list">
                          {vetDocPreviews.map((preview, i) => (
                            <div key={i} className="vet-doc-item">
                              <span className="vet-doc-name">{vetDocs[i]?.name || `Фото ${i + 1}`}</span>
                              <button type="button" className="remove-doc-btn" onClick={() => removeVetDoc(i)}><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-navigation">
                    <button className="back-btn" onClick={() => setStep(1)}>Назад</button>
                    <button className="next-btn" onClick={handleSubmit} disabled={isSubmitting}>Далее</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-section">
                  <h2 className="section-title"><CreditCard size={24} /> Оплата</h2>
                  
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-option-content"><CreditCard size={24} /><span>Банковской картой</span></div>
                    </label>
                    <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                      <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                      <div className="payment-option-content"><span>💵</span><span>Наличными при получении</span></div>
                    </label>
                  </div>

                  <div className="order-summary-mini">
                    <h3>Ваш заказ</h3>
                    {cartItems.map(item => (
                      <div key={item.product._id} className="summary-item">
                        <span className="item-name">{item.product.name}</span>
                        <span className="item-qty">{item.quantity} шт × {getPrice(item.product)} ₽</span>
                        <span className="item-total">{getPrice(item.product) * item.quantity} ₽</span>
                      </div>
                    ))}
                    <div className="summary-row"><span>Товары</span><span>{subtotal} ₽</span></div>
                    <div className="summary-row">
                      <span>Доставка ({deliveryMethod === 'pickup' ? 'самовывоз' : 'курьер'})</span>
                      <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                    </div>
                    <div className="summary-row total"><span>Итого</span><span>{total} ₽</span></div>
                  </div>

                  {hasVetMedicine && vetDocs.length > 0 && (
                    <div className="vet-doc-summary">
                      <h4><CheckCircle size={18} className="success-icon" /> Фото документа загружено</h4>
                      <ul>{vetDocs.map((doc, i) => <li key={i}>{doc.name}</li>)}</ul>
                    </div>
                  )}

                  {submitError && <div className="form-error">{submitError}</div>}

                  <div className="form-navigation">
                    {location.state?.repeatOrder ? null : (
                      <button className="back-btn" onClick={() => setStep(2)} disabled={isSubmitting}>Назад</button>
                    )}
                    <button className="confirm-btn" onClick={handleSubmit} disabled={isSubmitting || (hasVetMedicine && vetDocs.length === 0)}>
                      {isSubmitting ? <span className="spinner-mini" /> : <><CheckCircle size={20} /> Подтвердить заказ</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-sidebar">
              <h3 className="sidebar-title">Ваш заказ ({cartItems.reduce((s, i) => s + i.quantity, 0)} шт)</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.product._id} className="order-item">
                    <div className="order-item-image">
                      {item.product.images?.[0]?.url ? (
                        <img src={item.product.images[0].url.startsWith('http') ? item.product.images[0].url : `${API_BASE_URL}${item.product.images[0].url}`} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                    </div>
                    <div>
                      <p className="item-name">{item.product.name}</p>
                      <p className="item-qty">{item.quantity} шт × {getPrice(item.product)} ₽</p>
                    </div>
                    <span className="item-total">{getPrice(item.product) * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
              <div className="promo-code"><input type="text" placeholder="Промокод" disabled /><button disabled>Применить</button></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;