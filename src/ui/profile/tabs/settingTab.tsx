import React, { useState } from 'react';
import { Mail, Phone, User, Bell, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useProfileSettings } from '../../../function/profile/useSettings';
import '../style/profile/setting.css';

export interface SettingsTabProps {
  initialData?: { mail: string; phone?: string; login?: string };
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  initialData = { mail: 'user@example.com' } 
}) => {
  const { 
    profile, 
    loading, 
    error, 
    errorField,      
    updateProfile, 
    toggleDiscounts 
  } = useProfileSettings();

  const [formData, setFormData] = useState({
    login: initialData.login || '',
    phone: initialData.phone || '',
    mail: initialData.mail || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);


  React.useEffect(() => {
    if (profile) {
      setFormData({
        login: profile.login || '',
        phone: profile.phone || '',
        mail: profile.mail || '',
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleInputChange = (field: 'login' | 'phone' | 'mail', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError(null);
    if (errorField === field) {
   
    }
  };


  const validateLogin = (login: string): string | null => {
    if (!login || login.trim().length < 3) {
      return 'Логин должен содержать минимум 3 символа';
    }
    if (login.trim().length > 30) {
      return 'Логин не должен превышать 30 символов';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(login.trim())) {
      return 'Только латинские буквы, цифры, _ и -';
    }
    return null;
  };


  const validateContact = (field: 'phone' | 'mail', value: string): string | null => {
    if (field === 'phone' && value) {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?([0-9]{1,4}[-\s\.]?){1,4}[0-9]{1,9}$/;
      if (!phoneRegex.test(value)) return 'Неверный формат телефона';
    }
    if (field === 'mail' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Неверный формат email';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setSaveSuccess(false);

  
    if (formData.login !== profile?.login) {
      const loginError = validateLogin(formData.login);
      if (loginError) {
        setFormError(loginError);
        setIsSaving(false);
        return;
      }
    }

    const phoneError = validateContact('phone', formData.phone);
    const mailError = validateContact('mail', formData.mail);
    
    if (phoneError || mailError) {
      setFormError(phoneError || mailError);
      setIsSaving(false);
      return;
    }

    const willRemovePhone = formData.phone === '' && !formData.mail;
    const willRemoveMail = formData.mail === '' && !formData.phone;
    
    if (willRemovePhone || willRemoveMail) {
      setFormError('Нельзя удалить последний способ связи. Укажите альтернативный контакт.');
      setIsSaving(false);
      return;
    }


    const payload: Record<string, any> = {};
    if (formData.login !== profile?.login) payload.login = formData.login;
    if (formData.phone !== profile?.phone) payload.phone = formData.phone || undefined;
    if (formData.mail !== profile?.mail) payload.mail = formData.mail || undefined;


    if (Object.keys(payload).length === 0) {
      setIsSaving(false);
      setSaveSuccess(true);
      return;
    }

    const success = await updateProfile(payload);
    
    if (success) {
      setSaveSuccess(true);
    } else {

      setFormError(error || 'Не удалось сохранить изменения');
    }
    
    setIsSaving(false);
  };


  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner" />
        <p>Загрузка профиля...</p>
      </div>
    );
  }


  if (error && !profile) {
    return (
      <div className="settings-error">
        <AlertCircle size={20} />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h1 className="page-title">Настройки профиля</h1>
      
      <form className="settings-form" onSubmit={handleSubmit}>
        
        
        <div className="form-section">
          <h3><User size={18} /> Логин</h3>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input 
              type="text" 
              value={formData.login}
              onChange={(e) => handleInputChange('login', e.target.value)}
              placeholder="my_login"
              className={errorField === 'login' ? 'input-error' : ''}
            />
            <small className="hint">
              Латинские буквы, цифры, _ и - (3-30 символов)
            </small>
            {profile?.isVerified && (
              <small className="hint success">
                <CheckCircle size={12} /> Логин подтверждён
              </small>
            )}
          </div>
        </div>


        <div className="form-section">
          <h3>Контактные данные</h3>
          
          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              value={formData.mail}
              onChange={(e) => handleInputChange('mail', e.target.value)}
              placeholder="your@email.com"
              className={errorField === 'mail' ? 'input-error' : ''}
            />
            {profile?.phone && (
              <small className="hint">
                Можно изменить, так как указан телефон
              </small>
            )}
            {!profile?.phone && formData.mail && (
              <small className="hint warning">
                 Нельзя удалить: это ваш единственный способ связи
              </small>
            )}
          </div>

          <div className="form-group">
            <label><Phone size={16} /> Телефон</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className={errorField === 'phone' ? 'input-error' : ''}
            />
            {profile?.mail && (
              <small className="hint">
                Можно изменить, так как указан email
              </small>
            )}
            {!profile?.mail && formData.phone && (
              <small className="hint warning">
                Нельзя удалить: это ваш единственный способ связи
              </small>
            )}
          </div>
        </div>


        <div className="form-section">
          <h3><Bell size={18} /> Оповещения</h3>
          <label className="toggle-label">
            <span>Акции и скидки</span>
            <input 
              type="checkbox" 
              checked={!!profile?.notifications?.discounts}
              onChange={toggleDiscounts}
              disabled={!profile}
            />
          </label>
          <small className="hint">
            Получать уведомления о специальных предложениях
          </small>
        </div>

    
        {(formError || (error && errorField)) && (
          <div className="form-error">
            <AlertCircle size={14} /> 
            {formError || error}
            {errorField === 'login' && (
              <div className="error-suggestion">
                Попробуйте другой логин или добавьте цифры
              </div>
            )}
          </div>
        )}
        
        {saveSuccess && (
          <div className="form-success">
            <CheckCircle size={14} /> Изменения сохранены!
          </div>
        )}

   
        <button type="submit" className="save-btn" disabled={isSaving || loading}>
          <Save size={16} /> {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default SettingsTab;