import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User } from 'lucide-react';
import "./style/Header.css";

const HeaderLizard: React.FC = () => {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">O</div>
            <Link to="/" className="logo-text">ГАМА</Link>
          </div>
          
          <nav className="nav">
            <Link to="/catalog?category=reptiles">Рептилии</Link>
            <Link to="/catalog?category=accessories">Аксессуары</Link>
            <Link to="/catalog?category=medicine">Лекарства</Link>
            <Link to="/catalog?category=food">Корма</Link>
          </nav>

          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input type="text" className="search-input" placeholder="Поиск..." />
            </div>
            <Link to="/profile" className="header-btn">
              <User size={20} />
            </Link>
            <Link to="/cart" className="header-btn" style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              <span className="cart-badge">2</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-lizard">
        <div className="hero-logo-container">
          <h1 className="hero-logo-text">
            <div className="logo-circle-icon"></div>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>ГАМА</Link>
          </h1>
        </div>

        <nav className="hero-nav">
          <Link to="/catalog?category=reptiles" className="hero-nav-btn">Рептилии</Link>
          <Link to="/catalog?category=accessories" className="hero-nav-btn">Аксессуары</Link>
          <Link to="/catalog?category=medicine" className="hero-nav-btn">Лекарства</Link>
          <Link to="/catalog?category=food" className="hero-nav-btn">Корма</Link>
        </nav>

        <div className="hero-search-wrapper">
          <input 
            type="text" 
            className="hero-search-input" 
            placeholder="Поиск по товарам..." 
          />
          <Search className="hero-search-icon" size={20} />
        </div>
      </section>
    </>
  );
};

export default HeaderLizard;