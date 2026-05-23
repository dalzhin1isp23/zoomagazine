import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, Settings, LogOut, ClipboardList, LucideIcon } from 'lucide-react';
import { AdminTab } from './types';
import ProductsList from './tabs/ProductList';
import ProductEdit from './tabs/ProductEdit';
import ProductCreate from './tabs/ProductCreate';
import AdminOrders from './tabs/AdminOrders';
import { useNavigate, useLocation } from 'react-router-dom';
import "./style/styleAdmin.css";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isLogout?: boolean;
  onClick?: () => void;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const isEditRoute = location.pathname.includes('/edit');
  const isCreateRoute = location.pathname.includes('/create');

  const getButtonStyle = (isActive: boolean, isLogout: boolean = false): string => {
    const baseStyle = "admin-nav-item";
    const activeStyle = isActive ? "active" : "";
    const logoutStyle = isLogout ? "logout" : "";
    return `${baseStyle} ${activeStyle} ${logoutStyle}`;
  };

  const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, isActive, isLogout = false, onClick }) => (
    <button onClick={onClick} className={getButtonStyle(isActive, isLogout)}>
      <Icon size={20} /> {label}
    </button>
  );

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/');
  };

  const renderContent = () => {
    if (isEditRoute) return <ProductEdit />;
    if (isCreateRoute) return <ProductCreate />;
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-content">
            <h3>Дашборд</h3>
            <p>Статистика и аналитика будут здесь</p>
          </div>
        );
      case 'products':
        return <ProductsList />;
      case 'orders':
        return <AdminOrders />;
      default:
        return <ProductsList />;
    }
  };

  const getPageTitle = () => {
    if (isEditRoute) return 'Редактирование товара';
    if (isCreateRoute) return 'Добавление товара';
    switch (activeTab) {
      case 'dashboard': return 'Обзор';
      case 'products': return 'Управление товарами';
      case 'orders': return 'Управление заказами';
      default: return 'Обзор';
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon-small"></div>
          ГАМА ADMIN
        </div>
        
        <nav className="admin-nav">
          <NavButton 
            icon={LayoutDashboard} 
            label="Дашборд" 
            isActive={activeTab === 'dashboard' && !isEditRoute && !isCreateRoute} 
            onClick={() => { setActiveTab('dashboard'); navigate('/admin'); }}
          />
          <NavButton 
            icon={Package} 
            label="Товары" 
            isActive={activeTab === 'products' && !isEditRoute && !isCreateRoute} 
            onClick={() => { setActiveTab('products'); navigate('/admin'); }}
          />
          <NavButton 
            icon={ClipboardList} 
            label="Заказы" 
            isActive={activeTab === 'orders' && !isEditRoute && !isCreateRoute} 
            onClick={() => { setActiveTab('orders'); navigate('/admin'); }}
          />
          <NavButton icon={Users} label="Клиенты" isActive={false} />
          <NavButton icon={Settings} label="Настройки" isActive={false} />
        </nav>

        <NavButton icon={LogOut} label="Выйти" isActive={false} isLogout={true} onClick={handleLogout} />
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{getPageTitle()}</h1>
          <div className="admin-actions">
            <div className="admin-avatar">A</div>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;