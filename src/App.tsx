import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './ui/homepage/homepage';
import Catalog from './ui/catalog/Catalog';
import ProductDetail from './ui/productdetail/ProductDetail';
import Cart from './ui/cart/Cart';
import Checkout from './ui/checkout/Checkout';
import Profile from './ui/profile/Profile';
import AdminPanel from './ui/adminpanel/AdminPanel';
import Register from './ui/auth/Auth';
import Login from './ui/auth/Register';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Register />} />
        <Route path="/register" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;