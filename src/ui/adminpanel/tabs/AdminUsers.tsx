import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, User } from 'lucide-react';
import { useAdminUsers, AdminUser } from '../../../function/admin/useAdminUser';
import "../style/styleAdmin.css";

const ROLES = [
  { id: '6a0d78968c9a243088c4b258', name: 'Пользователь' },  
  { id: '6a0d78968c9a243088c4b250', name: 'Администратор' }, 
  { id: '6a0d78968c9a243088c4b252', name: 'Доставка' },    
  { id: '6a0d78968c9a243088c4b256', name: 'Поддержка' }   
];

const AdminUsers: React.FC = () => {
  const { users, isLoading, error, fetchUsers, updateRole } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers(search);
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
 
    setLoadingUserId(userId);
    try {
      await updateRole(userId, newRoleId);
    } catch (err) {
      alert('Не удалось изменить роль');
    } finally {
      setLoadingUserId(null);
    }
  };

  const getCurrentRoleId = (role: AdminUser['role']): string => {
    if (!role) return '';
    if (typeof role === 'string') return role;
    return role._id || '';
  };

  const getRoleName = (role: AdminUser['role']): string => {
    if (!role) return 'Не назначена';
    if (typeof role === 'string') {
     
      const found = ROLES.find(r => r.id === role);
      return found?.name || 'Неизвестная роль';
    }

    if (role.name) return role.name;

    const found = ROLES.find(r => r.id === role._id);
    return found?.name || 'Неизвестная роль';
  };

  if (isLoading && !users.length) return <div className="admin-loading">Загрузка пользователей...</div>;

  return (
    <div className="admin-orders">
      <div className="admin-filters">
        <div className="filter-group">
          <label>Поиск</label>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Логин, email или телефон..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="filter-search"
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={() => fetchUsers(search)} className="btn-secondary" disabled={isLoading}>
            <RefreshCw size={16} /> Обновить
          </button>
        </div>
      </div>

      {error && <div className="admin-error"><User size={18} /> {error}</div>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Регистрация</th>
              <th>Сменить роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const currentRoleId = getCurrentRoleId(user.role);
              const currentRoleName = getRoleName(user.role);
              
              return (
                <tr key={user._id}>
                  <td><strong>{user.login || '—'}</strong></td>
                  <td>{user.mail || '—'}</td>
                  <td>{user.phone || '—'}</td>
                  <td>
                    <span className={`status-badge ${currentRoleName.toLowerCase()}`}>
                      {currentRoleName}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <select
                      value={currentRoleId}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                      disabled={loadingUserId === user._id || isLoading}
                      className="filter-select"
                    >
                      <option value="">Не выбрано</option>
                      {ROLES.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && !isLoading && (
          <div className="admin-loading" style={{ textAlign: 'center', padding: '2rem' }}>
            Пользователи не найдены
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;