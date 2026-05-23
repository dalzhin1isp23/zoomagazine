import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useAdminOrders, AdminOrder, VetDocument, STATUS_NAME_MAP } from '../../../function/admin/useAdminOrders';
import "../style/styleAdmin.css";

const API_BASE_URL = 'http://127.0.0.1:3000';
const STATUS_OPTIONS = ['Новый', 'В обработке', 'Доставлен', 'Отменён'];

const AdminOrders: React.FC = () => {
  const { 
    orders, 
    pagination, 
    isLoading, 
    error, 
    fetchOrders, 
    updateOrderStatus, 
    verifyVetDocuments, 
    deleteOrder 
  } = useAdminOrders();
  
  const [filters, setFilters] = useState({ status: '', search: '', hasVetMedicine: false });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const apiFilters = { ...filters };
    if (apiFilters.hasVetMedicine === false) delete apiFilters.hasVetMedicine;
    fetchOrders(apiFilters);
  }, [fetchOrders]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const apiFilters = { ...filters };
    if (apiFilters.hasVetMedicine === false) delete apiFilters.hasVetMedicine;
    fetchOrders({ ...apiFilters, page: 1 });
  };

  const resetFilters = () => {
    setFilters({ status: '', search: '', hasVetMedicine: false });
    fetchOrders({ page: 1 });
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders({ ...filters, page: 1 });
    } catch (err) {
      alert('Ошибка обновления статуса');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVetVerify = async (orderId: string, isVerified: boolean) => {
    setActionLoading(orderId);
    try {
      const { success } = await verifyVetDocuments(
        orderId, 
        isVerified, 
        `Админ: ${new Date().toLocaleTimeString()}`
      );
      if (success) {
        const nextStatus = isVerified ? 'Отправлен' : 'Отменён';
        await updateOrderStatus(orderId, nextStatus);
        await fetchOrders({ ...filters, page: 1 });
      } else {
        alert('Ошибка проверки документов');
      }
    } catch (err) {
      alert('Ошибка действия');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Удалить заказ?')) {
      await deleteOrder(orderId);
      await fetchOrders({ ...filters, page: 1 });
    }
  };

  const getStatusName = (status: string | null | undefined): string => {
    if (!status) return 'Новый';
    return STATUS_NAME_MAP[status] || 'Новый';
  };

  const getStatusColor = (status: string | null | undefined): string => {
    const name = getStatusName(status);
    const n = name.toLowerCase();
    if (n.includes('доставлен')) return '#22c55e';
    if (n.includes('отправлен') || n.includes('обработ')) return '#f97316';
    if (n.includes('отмен')) return '#ef4444';
    return '#64748b';
  };

  const isVetVerified = (docs?: VetDocument[]): boolean => {
    return docs?.some(d => d?.isVerified) || false;
  };

  const formatDate = (d: string): string => {
    return new Date(d).toLocaleString('ru-RU');
  };

  const getImg = (imgs?: Array<{ url: string; isMain?: boolean }>): string => {
    if (!imgs?.length) return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    const main = imgs.find(img => img.isMain) || imgs[0];
    return main.url.startsWith('http') ? main.url : `${API_BASE_URL}${main.url}`;
  };

  if (isLoading && !orders.length) {
    return <div className="admin-loading">Загрузка...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-filters">
        <div className="filter-group">
          <label>Статус</label>
          <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="filter-select">
            <option value="">Все</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Поиск</label>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input type="text" placeholder="Адрес..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="filter-search" />
          </div>
        </div>
        <div className="filter-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={filters.hasVetMedicine} onChange={e => handleFilterChange('hasVetMedicine', e.target.checked)} />
            <span>Только ветпрепараты</span>
          </label>
        </div>
        <div className="filter-actions">
          <button onClick={applyFilters} className="btn-primary" disabled={isLoading}><Filter size={16} /> Применить</button>
          <button onClick={resetFilters} className="btn-primary" disabled={isLoading}><RefreshCw size={16} /> Сброс</button>
        </div>
      </div>

      {error && <div className="admin-error"><AlertCircle size={18} /> {error}</div>}

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Клиент</th>
              <th>Адрес</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Ветпрепараты</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const currentStatusName = getStatusName(order.status);
              
              return (
                <React.Fragment key={order._id}>
                  <tr className={expandedOrder === order._id ? 'expanded' : ''}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>
                      <div className="user-info">
                        <strong>{order.user?.login || '—'}</strong>
                        {order.user?.mail && <small>{order.user.mail}</small>}
                      </div>
                    </td>
                    <td>{order.city}, {order.adressPoint}</td>
                    <td className="order-sum">{order.sum} ₽</td>
                    <td>
                      <select
                        value={currentStatusName}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        disabled={actionLoading === order._id}
                        className="status-select"
                        style={{ borderColor: getStatusColor(order.status) }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {order.hasVetMedicine ? (
                        <span className={`vet-badge ${isVetVerified(order.vetDocuments) ? 'verified' : ''}`}>
                          {isVetVerified(order.vetDocuments) ? '✓ Пров.' : '⚠ Проверка'}
                        </span>
                      ) : (
                        <span className="no-vet">—</span>
                      )}
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="order-actions">
                      <button className="action-btn view" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}><Eye size={16} /></button>
                      {order.hasVetMedicine && !isVetVerified(order.vetDocuments) && (
                        <>
                          <button className="action-btn verify" onClick={() => handleVetVerify(order._id, true)} disabled={actionLoading === order._id}><CheckCircle size={16} /></button>
                          <button className="action-btn reject" onClick={() => handleVetVerify(order._id, false)} disabled={actionLoading === order._id}><XCircle size={16} /></button>
                        </>
                      )}
                      <button className="action-btn delete" onClick={() => handleDelete(order._id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr className="order-details">
                      <td colSpan={8}>
                        <div className="order-details-content">
                          <div className="order-products">
                            <h4>Товары:</h4>
                            {order.products.map((item, i) => (
                              <div key={i} className="order-product-item">
                                <img src={getImg(item.product.images)} alt="" className="product-thumb" />
                                <div className="product-info">
                                  <strong>{item.name}</strong>
                                  {item.product.isVetMedicine && <span className="vet-tag">🐾 Вет</span>}
                                  <small>{item.quantity} × {item.price} ₽</small>
                                </div>
                              </div>
                            ))}
                          </div>
                          {order.hasVetMedicine && order.vetDocuments?.length > 0 && (
                            <div className="order-vet-docs">
                              <h4>Документы:</h4>
                              {order.vetDocuments.map((doc: VetDocument, i) => (
                                <div key={i} className="vet-doc-item">
                                  <a href={`${API_BASE_URL}${doc.url}`} target="_blank" className="vet-doc-link">📄 {doc.filename}</a>
                                  {doc.isVerified && <span className="verified-badge">✓</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button onClick={() => {
            const apiFilters = { ...filters };
            if (apiFilters.hasVetMedicine === false) delete apiFilters.hasVetMedicine;
            fetchOrders({ ...apiFilters, page: pagination.page - 1 });
          }} disabled={pagination.page === 1 || isLoading}>← Назад</button>
          <span>{pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => {
            const apiFilters = { ...filters };
            if (apiFilters.hasVetMedicine === false) delete apiFilters.hasVetMedicine;
            fetchOrders({ ...apiFilters, page: pagination.page + 1 });
          }} disabled={pagination.page === pagination.totalPages || isLoading}>Вперёд →</button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;