import React, { ChangeEvent, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User } from 'lucide-react';
import "./style/Header.css";

const Header: React.FC = () => {
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
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <div className="logo-icon">O</div>
          <Link to="/" className="logo-text">ГАМА</Link>
        </div>
        
        <nav className="nav">
          {categoryLinks.map(link => (
            <Link key={link.name} to={link.path}>{link.name}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Поиск..." 
              onChange={handleSearchChange}
            />
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
  );
};

export default Header;