import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import whiskas from "./image/whiskas.png"
const Offers = () => {
  const products = [
    { id: 1, title: 'Корм Whiskas', price: 20, oldPrice: 50, discount: '50%', img: {whiskas} },
    { id: 1, title: 'Корм Whiskas', price: 20, oldPrice: 50, discount: '50%', img: {whiskas} },
    { id: 1, title: 'Корм Whiskas', price: 20, oldPrice: 50, discount: '50%', img: {whiskas} },
    { id: 1, title: 'Корм Whiskas', price: 20, oldPrice: 50, discount: '50%', img: {whiskas} },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Вкусные цены</h2>
        <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {products.map((product) => (
            <div key={product.id} className="modern-offer-card">
              {/* Верхняя часть (Белая подложка) */}
              <div className="offer-img-container">
                <div className="discount-badge">{product.discount}</div>
                <button className="wishlist-btn-top">
                  <Heart size={24} fill="#71b280" />
                </button>
                <img src={product.img} alt={product.title} />
              </div>

              {/* Нижняя часть (Инфо и цена) */}
              <div className="offer-info-bottom">
                <h3 className="offer-title-white">{product.title}</h3>
                
                <div className="price-container-white">
                  <div>
                    <span className="old-price">{product.oldPrice}₽</span>
                    <span className="current-price">{product.price}₽</span>
                  </div>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#71b280', 
                    cursor: 'pointer' 
                  }}>
                    <ShoppingCart size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;