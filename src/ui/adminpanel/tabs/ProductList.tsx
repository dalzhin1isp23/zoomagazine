import React, { useState, useEffect } from 'react';
import { useAdminProducts, useProductMutation } from '../../../function/admin/useAdminProducts';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:3000';

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { products, isLoading, error, pagination, refetch } = useAdminProducts({
    page,
    search: searchTerm,
    status: statusFilter,
  });

  const { deleteProduct } = useProductMutation();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      const success = await deleteProduct(id);
      if (success) {
        refetch();
      }
    }
  };

  const getStatusBadge = (remains: number | undefined) => {
    if (!remains || remains === 0) return <span className="status-badge out">Нет в наличии</span>;
    if (remains <= 5) return <span className="status-badge low">Мало</span>;
    return <span className="status-badge active">В наличии</span>;
  };

  const getImageUrl = (url?: string) => {
    if (!url) return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getMainImageUrl = (product: any) => {
    const mainImg = product.images?.find((img: any) => img.isMain);
    if (mainImg?.url) return getImageUrl(mainImg.url);
    if (product.images?.[0]?.url) return getImageUrl(product.images[0].url);
    return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
  };

  if (isLoading) {
    return <div className="loading-placeholder">Загрузка товаров...</div>;
  }

  if (error) {
    return (
      <div className="error-banner">
        {error}
        <button onClick={() => refetch()} className="retry-btn">Повторить</button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="admin-content empty-state">
        <h3 className="content-title">Товары не найдены</h3>
        <p>Добавьте первый товар или измените параметры поиска</p>
        <button className="add-btn" onClick={() => navigate('/admin/products/create')}>
          <Plus size={18} /> Добавить товар
        </button>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="content-header">
        <h3 className="content-title">Список товаров ({pagination.total})</h3>
        <button className="add-btn" onClick={() => navigate('/admin/products/create')}>
          <Plus size={18} /> Добавить товар
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={18} className="search-icon-small" />
          <input 
            type="text" 
            placeholder="Поиск по названию..." 
            className="admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="active">В наличии</option>
          <option value="low">Мало</option>
          <option value="out">Нет в наличии</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Изображение</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id?.toString() || product.id}>
                <td>
                  <img 
                    src={getMainImageUrl(product)}
                    alt={product.name || 'Товар'}
                    className="product-thumb"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${API_BASE_URL}/uploads/products/placeholder.jpg`;
                    }}
                  />
                </td>
                <td className="product-name-cell">{product.name || 'Без названия'}</td>
                <td>{product.price ? `${product.price} ₽` : '—'}</td>
                <td>{product.remains ?? 0} шт</td>
                <td>{getStatusBadge(product.remains)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => navigate(`/product/${product._id}`)}
                      title="Просмотр"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                      title="Редактировать"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(product._id)}
                      title="Удалить"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={!pagination.hasPrev}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="pagination-btn"
          >
            Назад
          </button>
          <span className="pagination-info">
            Страница {pagination.page} из {pagination.totalPages}
          </span>
          <button 
            disabled={!pagination.hasNext}
            onClick={() => setPage(p => p + 1)}
            className="pagination-btn"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;