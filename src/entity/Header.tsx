import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, X } from 'lucide-react';
import "./style/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (location.pathname === '/catalog') {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchValue(searchParam);
      }
    } else {
      setSearchValue('');
    }
  }, [location]);

  const categoryLinks = [
    { name: 'Корма', path: '/catalog?type=Корма' },
    { name: 'Ветеринария', path: '/catalog?type=Ветеринария' },
    { name: 'Игрушки', path: '/catalog?type=Игрушки' },
    { name: 'Аксессуары', path: '/catalog?type=Аксессуары' },
    { name: 'Лакомства', path: '/catalog?type=Лакомства' },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed.length >= 2) {
    
        navigate(`/catalog?search=${encodeURIComponent(trimmed)}`);
      } else if (trimmed === '' && location.pathname === '/catalog') {
        
        navigate('/catalog');
      }
    }, 400); 
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed.length >= 2) {
      navigate(`/catalog?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (location.pathname === '/catalog') {
      const params = new URLSearchParams(location.search);
      params.delete('search');
      navigate(`/catalog${params.toString() ? `?${params.toString()}` : ''}`);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      e.preventDefault();
      navigate('/login');
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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
            <Link 
              key={link.name} 
              to={link.path}
              className={location.pathname === '/catalog' && location.search.includes(link.path.split('?')[1]) ? 'active' : ''}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
   
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Поиск товаров..." 
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Поиск товаров"
            />
           
          </form>

          <Link to="/profile" className="header-btn" onClick={handleProfileClick} title="Профиль">
            <User size={20} />
          </Link>

          <Link to="/cart" className="header-btn" title="Корзина">
            <ShoppingBag size={20} />
          
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;