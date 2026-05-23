import React, { useState, ChangeEvent, useMemo, useEffect, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import ProductCard from '../../entity/ProductCards';
import { Filter, Grid, List, Search } from 'lucide-react'; 
import { ViewMode, ProductData, SortOption } from '../../function/products/filtration/types';
import { useProducts } from '../../function/products/useProducts';
import { useCategories } from '../../function/products/useCategories';
import { useTypes } from '../../function/products/useTypes';
import { useFavorites } from '../../function/profile/useFavorite'; 
import "./style/style.css";

const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUrlSync, setIsUrlSync] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();

  const { favorites, toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();

  const initialCategory = searchParams.get('category') || undefined;
  const initialType = searchParams.get('type') || undefined;
  const initialSearch = searchParams.get('search') || undefined;
  const initialSort = (searchParams.get('sort') as SortOption) || 'popularity';

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
    initialLimit: 12,
    initialSort: initialSort,
    autoFetch: true,
    initialFilters: {
      category: initialCategory,
      type: initialType,
      search: initialSearch
    }
  });

  const { categories: categoryList, isLoading: categoriesLoading } = useCategories();
  const { types: typeList, isLoading: typesLoading } = useTypes();

  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlType = searchParams.get('type');
    const urlSearch = searchParams.get('search');
    const urlSort = searchParams.get('sort') as SortOption;

    const normalizeToDbName = (param: string | null, list: { name: string }[]) => {
      if (!param || list.length === 0) return param || undefined;
      const lowerParam = param.toLowerCase();
      const match = list.find(item => item.name.toLowerCase() === lowerParam);
      return match ? match.name : param;
    };

    setIsUrlSync(true);
    setFilters({
      category: normalizeToDbName(urlCategory, categoryList),
      type: normalizeToDbName(urlType, typeList),
      search: urlSearch || undefined
    });

    if (urlSort && urlSort !== sort) {
      setSort(urlSort);
    }

    const pageParam = searchParams.get('page');
    if (pageParam && !isNaN(Number(pageParam))) {
      setPage(Number(pageParam));
    }
  }, [searchParams.toString(), categoryList, typeList]);

  useEffect(() => {
    if (isUrlSync) {
      setIsUrlSync(false);
      return;
    }
    
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;
    if (sort && sort !== 'popularity') params.sort = sort;
    if (pagination.page > 1) params.page = String(pagination.page);
    
    setSearchParams(params, { replace: true });
  }, [filters.category, filters.type, filters.search, sort, pagination.page, setSearchParams, isUrlSync]);

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
    setFilters({ category: e.target.value || undefined, page: 1 });

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ type: e.target.value || undefined, page: 1 });

  const handlePriceChange = (field: 'min' | 'max', value: string) =>
    setFilters({
      [field === 'min' ? 'minPrice' : 'maxPrice']: value ? Number(value) : undefined,
      page: 1
    });

  const handleCheckboxChange = (field: 'inStock' | 'hasDiscount', checked: boolean) =>
    setFilters({ [field]: checked || undefined, page: 1 });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
   
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = localSearch.trim();

    if (trimmed.length >= 2) {
      setFilters({ search: trimmed, page: 1 });
    } else if (trimmed === '') {
    
      setFilters({ search: undefined, page: 1 });
    }
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setFilters({ search: undefined, page: 1 });
  };

  const findMatchingValue = (urlValue: string | undefined, list: { name: string }[]) => {
    if (!urlValue || list.length === 0) return urlValue || '';
    const lowerParam = urlValue.toLowerCase();
    const match = list.find(item => item.name.toLowerCase() === lowerParam);
    return match ? match.name : urlValue;
  };

  return (
    <>
      <Header />
      <div className="catalog-page">
        <div className="container">
         
          <div className="breadcrumbs">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span> 
            <span>/</span> 
            <span>Каталог</span>
            {filters.search && (
              <>
                <span>/</span>
                <span className="search-breadcrumb">
                  <Search size={14} />
                  Поиск: "{filters.search}"
                </span>
              </>
            )}
          </div>

          <div className="catalog-header">
            <h1 className="catalog-title">
              Каталог товаров
              {filters.search && <span className="search-results-count">({pagination.total} найдено)</span>}
            </h1>
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

          {/* Ошибка */}
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
                    value={findMatchingValue(filters.category, categoryList) || filters.category || ''}
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
                    value={findMatchingValue(filters.type, typeList) || filters.type || ''}
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
                  <label className="filter-label">Цена, ₽</label>
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
                    <span className="price-separator">—</span>
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
                  <label className="filter-label">Дополнительно</label>
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
                  <label className="filter-label">Поиск в каталоге</label>
                  <form className="search-filter-form" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Введите и нажмите Enter..."
                      className="search-filter-input"
                      value={localSearch}
                      onChange={handleSearchChange}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                  
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchSubmit(e);
                        }
                      }}
                    />
                
                  </form>
                
                  {localSearch && (
                    <button 
                      type="button" 
                      className="search-reset-link" 
                      onClick={handleClearSearch}
                    >
                      Сбросить поиск
                    </button>
                  )}
                </div>

                <div className="filter-actions">
                  <button
                    className="search-reset-link"
                    onClick={reset}
                    disabled={isLoading}
                  >
                    Сбросить все
                  </button>
                  {isLoading && (
                    <span className="loading-indicator">Загрузка...</span>
                  )}
                </div>
              </div>
            </aside>

            <main className="catalog-grid">
       
              <div className="catalog-results-info">
                <span className="results-count">
                  {isLoading
                    ? 'Обновление...'
                    : error
                      ? 'Ошибка загрузки'
                      : `${pagination.total} ${pagination.total === 1 ? 'товар' : pagination.total < 5 ? 'товара' : 'товаров'}`
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
                  <option value="rating">По рейтингу</option>
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
                      onToggleFavorite={toggleFavorite}             
                      isFavorite={checkIsFavorite(product._id)}      
                    />
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <p>Товары не найдены</p>
                    <p className="no-results-hint">
                      {filters.search 
                        ? `По запросу "${filters.search}" ничего не найдено`
                        : 'Попробуйте изменить фильтры'
                      }
                    </p>
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