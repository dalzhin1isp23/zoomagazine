import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import useAuth from '../../function/profile/useAuth';
import "./style/Auth.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    mail: '',
    phone: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }
    
    try {
      await register(formData.login, formData.password, formData.mail, formData.phone);
    } catch (err) {
    }
  };

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

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Имя *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Иван"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Иванов"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} />
                  Логин *
                </label>
                <input
                  type="text"
                  name="login"
                  placeholder="ivan123"
                  className="form-input"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="mail"
                  placeholder="example@mail.ru"
                  className="form-input"
                  value={formData.mail}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={18} />
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 (999) 000-00-00"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} />
                  Пароль *
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="password-hint">Минимум 6 символов</p>
              </div>

              {error && <div className="form-error">{error}</div>}

              <label className="checkbox-label terms-label">
                <input 
                  type="checkbox" 
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <span>
                  Я принимаю <Link to="/terms">условия использования</Link> и <Link to="/privacy">политику конфиденциальности</Link> *
                </span>
              </label>

              <button type="submit" className="auth-btn" disabled={isLoading || !formData.acceptTerms}>
                {isLoading ? 'Создание...' : (
                  <>
                    Создать аккаунт
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

           
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