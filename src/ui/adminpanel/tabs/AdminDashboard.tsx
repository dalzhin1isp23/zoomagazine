import React, { useEffect } from 'react';
import { 
  Package, Users, ShoppingCart, DollarSign, AlertTriangle, 
  Clock, TrendingUp, CheckCircle, XCircle, ArrowRight, RefreshCw 
} from 'lucide-react';
import { useAdminDashboard } from '../../../function/admin/useDashboard';
import "../style/styleAdmin.css";

const AdminDashboard: React.FC = () => {
  const { stats, recentOrders, lowStock, statusDist, isLoading, error, fetchDashboard } = useAdminDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
  };

  const getStatusColor = (statusName: string) => {
    const map: Record<string, string> = {
      'Новый': 'status-new',
      'В обработке': 'status-processing',
      'Доставлен': 'status-delivered',
      'Отменён': 'status-cancelled'
    };
    return map[statusName] || 'status-default';
  };

  if (isLoading && !stats) {
    return <div className="admin-loading">Загрузка данных...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Обзор</h2>
        <button onClick={() => fetchDashboard()} className="btn-secondary" disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spinning' : ''} /> Обновить
        </button>
      </div>

      {error && <div className="admin-error"><AlertTriangle size={18} /> {error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><ShoppingCart size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalOrders ?? 0}</span>
            <span className="stat-label">Всего заказов</span>
          </div>
          <div className="stat-trend">
            <TrendingUp size={14} /> +{stats?.todayOrders ?? 0} сегодня
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue"><DollarSign size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{formatCurrency(stats?.totalRevenue ?? 0)}</span>
            <span className="stat-label">Общая выручка</span>
          </div>
          <div className="stat-trend positive">
            <TrendingUp size={14} /> +{formatCurrency(stats?.todayRevenue ?? 0)} сегодня
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalUsers ?? 0}</span>
            <span className="stat-label">Пользователей</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products"><Package size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalProducts ?? 0}</span>
            <span className="stat-label">Товаров в каталоге</span>
          </div>
          <div className="stat-trend warning">
            <AlertTriangle size={14} /> {stats?.lowStockProducts ?? 0} мало на складе
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3 className="panel-title">
            <Clock size={18} /> Последние заказы
          </h3>
          <div className="orders-mini-list">
            {recentOrders.length === 0 ? (
              <p className="empty-state">Нет новых заказов</p>
            ) : (
              recentOrders.map(order => (
                <div key={order._id} className="mini-order-item">
                  <div className="mini-order-info">
                    <span className="mini-order-id">#{order._id.slice(-6)}</span>
                    <span className="mini-order-user">{order.user.login}</span>
                  </div>
                  <div className="mini-order-sum">{formatCurrency(order.sum)}</div>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
              ))
            )}
          </div>
          <button className="view-all-btn">
            Все заказы <ArrowRight size={14} />
          </button>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">
            <AlertTriangle size={18} /> Мало на складе
          </h3>
          <div className="low-stock-list">
            {lowStock.length === 0 ? (
              <p className="empty-state"><CheckCircle size={16} /> Все товары в наличии</p>
            ) : (
              lowStock.map(product => (
                <div key={product._id} className="low-stock-item">
                  <span className="stock-name">{product.name}</span>
                  <span className="stock-remains">{product.remains} шт.</span>
                  <span className="stock-price">{formatCurrency(product.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <h3 className="panel-title">
            <CheckCircle size={18} /> Статусы заказов
          </h3>
          <div className="status-distribution">
            {statusDist.map(item => {
              const percentage = stats?.totalOrders 
                ? Math.round((item.count / stats.totalOrders) * 100) 
                : 0;
              return (
                <div key={item.statusId} className="status-row">
                  <span className="status-name">{item.statusName}</span>
                  <div className="status-bar">
                    <div 
                      className={`status-fill ${getStatusColor(item.statusName)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="status-count">{item.count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;