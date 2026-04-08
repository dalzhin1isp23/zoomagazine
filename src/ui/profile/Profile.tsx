import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { User, Package, Heart, Settings, LogOut, Mail, Phone, MapPin } from 'lucide-react';
import useAuth from '../../function/profile/useAuth';
import "./style/style.css"

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const { user, token, logout, fetchUserProfile, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      
      if (!storedToken) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        await fetchUserProfile();
      } catch (err) {
        navigate('/login', { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, fetchUserProfile]);

  useEffect(() => {
    if (token && user) {
      loadOrders();
    }
  }, [token, user]);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/auth/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const getStatusColor = (status: Order['status']): string => {
    switch(status) {
      case 'delivered': return '#22c55e';
      case 'shipping': return '#f97316';
      case 'processing': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch(status) {
      case 'delivered': return 'Доставлен';
      case 'shipping': return 'В пути';
      case 'processing': return 'Обрабатывается';
      default: return status;
    }
  };

  if (isLoading || isCheckingAuth) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      
      <div className="profile-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Личный кабинет</span>
          </div>

          <div className="profile-content">
            <aside className="profile-sidebar">
              <div className="profile-user-card">
                <div className="user-avatar">
                  <User size={40} />
                </div>
                <h3>{user?.mail?.split('@')[0] || 'Пользователь'}</h3>
                <p>{user?.mail || 'email@example.com'}</p>
                {user?.phone && (
                  <p className="user-phone">{user.phone}</p>
                )}
              </div>

              <nav className="profile-nav">
                <button 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('orders')}
                >
                  <Package size={20} /> Мои заказы
                </button>
                <button 
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('wishlist')}
                >
                  <Heart size={20} /> Избранное
                </button>
                <button 
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={20} /> Настройки
                </button>
                <button className="nav-item logout" onClick={logout}>
                  <LogOut size={20} /> Выйти
                </button>
              </nav>
            </aside>

            <main className="profile-main">
              {activeTab === 'orders' && (
                <div className="tab-content">
                  <h1 className="page-title">Мои заказы</h1>
                  
                  <div className="orders-list">
                    {orders.length > 0 ? orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        
                        <div className="order-body">
                          <div className="order-items-preview">
                            <div style={{fontSize: '40px'}}>🦎</div>
                            <div style={{fontSize: '40px'}}>🏠</div>
                            <span className="more-items">+2</span>
                          </div>
                          
                          <div className="order-info">
                            <div className="order-total">
                              <span>Сумма:</span>
                              <strong>{order.total}</strong>
                            </div>
                            <div 
                              className="order-status" 
                              style={{color: getStatusColor(order.status)}}
                            >
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>

                        <div className="order-footer">
                          <button className="order-details-btn">Подробнее</button>
                          <button className="repeat-order-btn">Повторить заказ</button>
                        </div>
                      </div>
                    )) : (
                      <div className="empty-state">
                        <Package size={48} />
                        <p>У вас пока нет заказов</p>
                        <button onClick={() => navigate('/catalog')}>
                          Перейти в каталог
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="tab-content">
                  <h1 className="page-title">Избранное</h1>
                  
                  <div className="wishlist-grid">
                    <div className="product-card">
                      <div className="product-image">
                        <div style={{fontSize: '60px'}}>🦎</div>
                      </div>
                      <h3>Корм Premium</h3>
                      <p className="price">2 500 ₽</p>
                      <button className="add-to-cart-btn">В корзину</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="tab-content">
                  <h1 className="page-title">Настройки профиля</h1>
                  
                  <div className="settings-form">
                    <div className="form-section">
                      <h3>Личная информация</h3>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Имя</label>
                          <input 
                            type="text" 
                            defaultValue={user?.mail?.split('@')[0]} 
                          />
                        </div>
                        <div className="form-group">
                          <label>Фамилия</label>
                          <input type="text" defaultValue="" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          <Mail size={16} /> Email
                        </label>
                        <input 
                          type="email" 
                          defaultValue={user?.mail} 
                          readOnly 
                          className="readonly-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <Phone size={16} /> Телефон
                        </label>
                        <input 
                          type="tel" 
                          defaultValue={user?.phone || ''} 
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <MapPin size={16} /> Адрес
                        </label>
                        <input type="text" defaultValue="" />
                      </div>

                      <button className="save-btn">Сохранить изменения</button>
                    </div>

                    <div className="form-section">
                      <h3>Безопасность</h3>
                      <button className="change-password-btn">
                        Изменить пароль
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;