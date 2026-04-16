import React, { useState, ChangeEvent, useMemo, useEffect } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import ProductCard from '../../entity/ProductCards';
import { Filter, Grid, List } from 'lucide-react';
import { ViewMode, ProductData, SortOption } from '../../function/products/filtration/types';
import { useProducts } from '../../function/products/useProducts';
import { useCategories } from '../../function/products/useCategories';
import { useTypes } from '../../function/products/useTipes';
import "./style/style.css";

const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    products,
    pagination,
    filters,
    sort,
    isLoading,
    error,
    setPage,
    setFilters,
    setSort,
    reset,
    refetch
  } = useProducts({
    initialLimit: 9,
    initialSort: 'popularity',
    autoFetch: true
  });

  const { categories: categoryList, isLoading: categoriesLoading } = useCategories();
  const { types: typeList, isLoading: typesLoading } = useTypes();

  const paginationButtons = useMemo(() => {
    const { totalPages, page } = pagination;
    if (totalPages <= 1) return [];

    const buttons: (number | '...')[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    if (start > 1) { buttons.push(1); if (start > 2) buttons.push('...'); }
    for (let i = start; i <= end; i++) buttons.push(i);
    if (end < totalPages) { if (end < totalPages - 1) buttons.push('...'); buttons.push(totalPages); }
    return buttons;
  }, [pagination]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ category: e.target.value || undefined });

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ type: e.target.value || undefined });

  const handlePriceChange = (field: 'min' | 'max', value: string) =>
    setFilters({
      [field === 'min' ? 'minPrice' : 'maxPrice']: value ? Number(value) : undefined
    });

  const handleCheckboxChange = (field: 'inStock' | 'hasDiscount', checked: boolean) =>
    setFilters({ [field]: checked || undefined });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setFilters({ search: e.target.value || undefined });

  return (
    <>
      <Header />
      <div className="catalog-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Каталог</span>
          </div>

          <div className="catalog-header">
            <h1 className="catalog-title">Каталог товаров</h1>
            <div className="catalog-controls">
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label="Вид: сетка"
                >
                  <Grid size={20} />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="Вид: список"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              {error}
              <button onClick={refetch} className="retry-btn">Повторить</button>
            </div>
          )}

          <div className="catalog-content">
            <aside className="catalog-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">
                  <Filter size={18} /> Фильтры
                </h3>

                <div className="filter-group">
                  <label className="filter-label">Категория</label>
                  <select
                    className="filter-select"
                    value={filters.category || ''}
                    onChange={handleCategoryChange}
                    disabled={isLoading || categoriesLoading}
                  >
                    <option value="">Все категории</option>
                    {categoryList.map(cat => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Тип</label>
                  <select
                    className="filter-select"
                    value={filters.type || ''}
                    onChange={handleTypeChange}
                    disabled={isLoading || typesLoading}
                  >
                    <option value="">Все типы</option>
                    {typeList.map(typ => (
                      <option key={typ._id} value={typ.name}>
                        {typ.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Цена</label>
                  <div className="price-range">
                    <input
                      type="number"
                      placeholder="От"
                      className="price-input"
                      value={filters.minPrice ?? ''}
                      onChange={e => handlePriceChange('min', e.target.value)}
                      disabled={isLoading}
                      min="0"
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="До"
                      className="price-input"
                      value={filters.maxPrice ?? ''}
                      onChange={e => handlePriceChange('max', e.target.value)}
                      disabled={isLoading}
                      min="0"
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Наличие</label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!filters.inStock}
                      onChange={e => handleCheckboxChange('inStock', e.target.checked)}
                      disabled={isLoading}
                    />
                    <span>В наличии</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!filters.hasDiscount}
                      onChange={e => handleCheckboxChange('hasDiscount', e.target.checked)}
                      disabled={isLoading}
                    />
                    <span>Со скидкой</span>
                  </label>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Поиск</label>
                  <input
                    type="text"
                    placeholder="Название товара..."
                    className="search-input"
                    value={filters.search || ''}
                    onChange={handleSearch}
                    disabled={isLoading}
                  />
                </div>

                <div className="filter-actions">
                  <button
                    className="filter-apply-btn"
                    onClick={reset}
                    disabled={isLoading}
                  >
                    Сбросить
                  </button>
                  {isLoading && (
                    <span className="loading-indicator">Загрузка...</span>
                  )}
                </div>
              </div>
            </aside>

            <main className="catalog-grid">
              <div className="catalog-results-info">
                <span>
                  {isLoading
                    ? 'Обновление...'
                    : error
                      ? 'Ошибка загрузки'
                      : `${pagination.total} товаров`
                  }
                </span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  disabled={isLoading}
                >
                  <option value="popularity">По популярности</option>
                  <option value="price-asc">Сначала дешёвые</option>
                  <option value="price-desc">Сначала дорогие</option>
                  <option value="newest">Новинки</option>
                </select>
              </div>

              <div className={`products-grid ${viewMode}`}>
                {isLoading && (!products || products.length === 0) ? (
                  <div className="loading-placeholder">Загрузка товаров...</div>
                ) : products && products.length > 0 ? (
                  products.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <p>🔍 Товары не найдены</p>
                    <button onClick={reset} className="reset-filters-btn">
                      Сбросить фильтры
                    </button>
                  </div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={!pagination.hasPrev || isLoading}
                    onClick={() => setPage(pagination.page - 1)}
                    aria-label="Предыдущая страница"
                  >
                    ←
                  </button>

                  {paginationButtons.map((btn, i) => (
                    typeof btn === 'number' ? (
                      <button
                        key={btn}
                        className={`page-btn ${btn === pagination.page ? 'active' : ''}`}
                        onClick={() => setPage(btn)}
                        disabled={isLoading}
                        aria-current={btn === pagination.page ? 'page' : undefined}
                      >
                        {btn}
                      </button>
                    ) : (
                      <span key={`dots-${i}`} className="pagination-dots">...</span>
                    )
                  ))}

                  <button
                    className="page-btn"
                    disabled={!pagination.hasNext || isLoading}
                    onClick={() => setPage(pagination.page + 1)}
                    aria-label="Следующая страница"
                  >
                    →
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;