import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import useAuth from '../../function/profile/useAuth';
import "./style/Auth.css";

const Login: React.FC = () => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginValue.trim() || !password.trim()) return;

    try {
      await login(loginValue.trim(), password);
    } catch {
      // Ошибка уже установлена в setError внутри useAuth
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Вход</h1>
              <p className="auth-subtitle">Добро пожаловать обратно!</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} /> Логин
                </label>
                <input
                  type="text"
                  placeholder="example@mail.ru"
                  className="form-input"
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} /> Пароль
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" disabled={isLoading} />
                  <span>Запомнить меня</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Забыли пароль?
                </Link>
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? 'Загрузка...' : <>Войти <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="auth-footer">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;