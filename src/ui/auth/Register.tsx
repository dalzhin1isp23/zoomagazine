import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import "./style/Auth.css";

const Register: React.FC = () => {
  return (
    <>
      <Header />
      
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Регистрация</h1>
              <p className="auth-subtitle">Создайте аккаунт для покупок</p>
            </div>

            <form className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Имя *
                  </label>
                  <input
                    type="text"
                    placeholder="Иван"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Фамилия</label>
                  <input
                    type="text"
                    placeholder="Иванов"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} />
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="example@mail.ru"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={18} />
                  Телефон
                </label>
                <input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} />
                  Пароль *
                </label>
                <div className="password-wrapper">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-input"
                  />
                  <button type="button" className="password-toggle">
                    <Eye size={18} />
                  </button>
                </div>
                <p className="password-hint">Минимум 6 символов</p>
              </div>

              <label className="checkbox-label terms-label">
                <input type="checkbox" />
                <span>
                  Я принимаю <Link to="/terms">условия использования</Link> и <Link to="/privacy">политику конфиденциальности</Link> *
                </span>
              </label>

              <Link to="/profile" className="auth-btn">
                Создать аккаунт
                <ArrowRight size={18} />
              </Link>
            </form>

            <div className="auth-divider">
              <span>или</span>
            </div>

            <div className="social-login">
              <button className="social-btn google">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="social-btn vk">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zM17.5 13.5c.33.5.5 1 .17 1.33-.33.33-.83.33-1.33 0l-2.17-1.5c-.33-.17-.5-.17-.67.17l-.67 1.17c-.17.33-.33.5-.67.5h-1.33c-.5 0-.67-.33-.5-.83l2.67-4.33c.17-.33.17-.67-.17-.83l-1.67-1c-.33-.17-.67-.17-.83.17l-.5.83c-.17.33-.5.33-.83.17l-1.17-.67c-.33-.17-.5-.5-.33-.83l1.83-3c.17-.33.5-.5.83-.33l1.5.83c.33.17.67.17.83-.17l.5-.83c.17-.33.5-.5.83-.33l2.17 1.17c.33.17.5.5.33.83l-2.33 4c-.17.33-.17.67.17.83l2.83 2z"/>
                </svg>
                VK
              </button>
            </div>

            <p className="auth-footer">
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>

          <div className="auth-benefits">
            <h4>Преимущества аккаунта:</h4>
            <ul>
              <li><Check size={16} /> Быстрое оформление заказа</li>
              <li><Check size={16} /> История покупок</li>
              <li><Check size={16} /> Персональные скидки</li>
              <li><Check size={16} /> Отслеживание доставки</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;