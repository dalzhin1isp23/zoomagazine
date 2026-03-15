import React, { useState, ChangeEvent } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import ProductCard from '../../entity/ProductCards';
import { Filter, Grid, List } from 'lucide-react';
import { Product, Category, ViewMode } from '../../types';
import "./style/style.css"

const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: Category[] = [
    { id: 'all', name: 'Все товары' },
    { id: 'reptiles', name: 'Рептилии' },
    { id: 'food', name: 'Корма' },
    { id: 'accessories', name: 'Аксессуары' },
    { id: 'medicine', name: 'Лекарства' },
  ];

  const products: Product[] = [
    { id: 1, title: 'Корм Premium', price: 2500, oldPrice: 3200, discount: '-22%', img: '🦎' },
    { id: 2, title: 'Террариум малый', price: 4500, oldPrice: null, discount: null, img: '🏠' },
    { id: 3, title: 'Лампа УФ', price: 890, oldPrice: 1200, discount: '-26%', img: '💡' },
    { id: 4, title: 'Грунт натуральный', price: 350, oldPrice: 500, discount: '-30%', img: '🪨' },
    { id: 5, title: 'Поилка керамическая', price: 450, oldPrice: null, discount: null, img: '🥣' },
    { id: 6, title: 'Витамины для рептилий', price: 680, oldPrice: 850, discount: '-20%', img: '💊' },
  ];

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
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                  <Grid size={20} />
                </button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="catalog-content">
            <aside className="catalog-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">
                  <Filter size={18} />
                  Фильтры
                </h3>

                <div className="filter-group">
                  <label className="filter-label">Категория</label>
                  <select className="filter-select" value={selectedCategory} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Цена</label>
                  <div className="price-range">
                    <input type="number" placeholder="От" className="price-input" />
                    <span>—</span>
                    <input type="number" placeholder="До" className="price-input" />
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Наличие</label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>В наличии</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Со скидкой</span>
                  </label>
                </div>

                <button className="filter-apply-btn">Применить</button>
              </div>
            </aside>

            <main className="catalog-grid">
              <div className="catalog-results-info">
                <span>{products.length} товаров найдено</span>
                <select className="sort-select">
                  <option>По популярности</option>
                  <option>Сначала дешевые</option>
                  <option>Сначала дорогие</option>
                  <option>Новинки</option>
                </select>
              </div>

              <div className={`products-grid ${viewMode}`}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="pagination">
                <button className="page-btn">←</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">→</button>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Catalog;