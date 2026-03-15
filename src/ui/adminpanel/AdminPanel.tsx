import React, { useState } from 'react';
import { LayoutDashboard, Package, Users, Settings, LogOut, Plus, Search, LucideIcon } from 'lucide-react';
import { AdminProduct, AdminTab } from '../../types';
import "./style/style.css"

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isLogout?: boolean;
  onClick?: () => void;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const products: AdminProduct[] = [
    { id: 1, name: 'Корм Premium', price: '2500 ₽', stock: '45 шт', status: 'active' },
    { id: 2, name: 'Террариум малый', price: '4500 ₽', stock: '12 шт', status: 'active' },
    { id: 3, name: 'Лампа УФ', price: '890 ₽', stock: '5 шт', status: 'low' },
    { id: 4, name: 'Витамины', price: '680 ₽', stock: '0 шт', status: 'out' },
  ];

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
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavButton 
            icon={Package} 
            label="Товары" 
            isActive={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
          />
          <NavButton icon={Users} label="Клиенты" isActive={false} />
          <NavButton icon={Settings} label="Настройки" isActive={false} />
        </nav>

        <NavButton icon={LogOut} label="Выйти" isActive={false} isLogout={true} />
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{activeTab === 'products' ? 'Управление товарами' : 'Обзор'}</h1>
          <div className="admin-actions">
            <div className="admin-search">
              <Search size={18} className="search-icon-small" />
              <input type="text" placeholder="Поиск..." className="admin-search-input" />
            </div>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <div className="content-header">
            <h3 className="content-title">Список товаров</h3>
            <button className="add-btn"><Plus size={18} /> Добавить товар</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Остаток</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status === 'active' ? 'В наличии' : product.status === 'low' ? 'Мало' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn edit">Ред.</button>
                    <button className="action-btn delete">Удал.</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;