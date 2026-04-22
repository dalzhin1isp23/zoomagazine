import React from 'react';
import { Mail, Phone, MapPin, Bell, Save, Lock } from 'lucide-react';
import "../style/profile/setting.css";
export interface settingsTabProps {
  user?: { mail: string; phone?: string };
  onSave?: (data: any) => void;
}

const settingsTab: React.FC<settingsTabProps> = ({ 
  user = { mail: 'user@example.com', phone: '+7 (999) 123-45-67' },
  onSave = () => {},
}) => {
  return (
    <div className="tab-content">
      <h1 className="page-title">Настройки профиля</h1>
      
      <form className="settings-form" onSubmit={(e) => { e.preventDefault(); onSave({}); }}>
        <div className="form-section">
          <h3> Личная информация</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Имя</label>
              <input type="text" defaultValue="Пользователь" />
            </div>
            <div className="form-group">
              <label>Фамилия</label>
              <input type="text" defaultValue="" />
            </div>
          </div>

          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              defaultValue={user.mail} 
              readOnly 
              className="readonly-input"
            />
            <small className="hint">Email нельзя изменить</small>
          </div>

          <div className="form-group">
            <label><Phone size={16} /> Телефон</label>
            <input 
              type="tel" 
              defaultValue={user.phone}
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div className="form-group">
            <label><MapPin size={16} /> Адрес доставки</label>
            <input 
              type="text" 
              placeholder="Город, улица, дом, квартира"
            />
          </div>
        </div>

        <div className="form-section">
          <h3> Уведомления</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <span>Статус заказов</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="toggle-label">
              <span>Акции и скидки</span>
              <input type="checkbox" />
            </label>
            <label className="toggle-label">
              <span>Напоминания о питомце</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3> История заказов</h3>
          <label className="toggle-label">
            <span>Сохранять историю заказов</span>
            <input type="checkbox" defaultChecked />
          </label>
          <small className="hint">
            При отключении старые заказы будут скрыты, но не удалены
          </small>
        </div>

        <div className="form-section">
          <h3> Безопасность</h3>
          <button type="button" className="change-password-btn">
            <Lock size={16} /> Изменить пароль
          </button>
        </div>

        <button type="submit" className="save-btn">
          <Save size={16} /> Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default settingsTab;