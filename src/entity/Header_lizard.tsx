import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "./Header";
import { Search, ShoppingBag, User } from 'lucide-react';
import "./style/Header.css";

const HeaderLizard: React.FC = () => {
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const categoryLinks = [
    { name: 'Корма', path: '/catalog?type=Корма' },
    { name: 'Ветеринария', path: '/catalog?type=Ветеринария' },
    { name: 'Игрушки', path: '/catalog?type=Игрушки' },
    { name: 'Аксессуары', path: '/catalog?type=Аксессуары' },
    { name: 'Лакомства', path: '/catalog?type=Лакомства' },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/catalog?search=${encodeURIComponent(value)}`);
      } else {
        navigate('/catalog');
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Header/>
      <section className="hero-lizard">
        <div className="hero-logo-container">
          <h1 className="hero-logo-text">
            <div className="logo-circle-icon"></div>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>ГАМА</Link>
          </h1>
        </div>

        <nav className="hero-nav">
          {categoryLinks.map(link => (
            <Link key={`hero-${link.name}`} to={link.path} className="hero-nav-btn">{link.name}</Link>
          ))}
        </nav>

        <div className="hero-search-wrapper">
          <input 
            type="text" 
            className="hero-search-input" 
            placeholder="Поиск по товарам..." 
            onChange={handleSearchChange}
          />
          <Search className="hero-search-icon" size={20} />
        </div>
      </section>
    </>
  );
};

export default HeaderLizard;