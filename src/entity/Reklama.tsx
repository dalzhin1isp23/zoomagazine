import React from 'react';
import Reklam_pic from "./image/Reklama.jpg"

const Reklama = () => {
  return (
    <div className="container">
      <section className="promo-hero">
  
        <img 
          src={Reklam_pic} 
          alt="Lizard promo"
          className="promo-image"
        />
        
        
        <div className="promo-overlay" />

        <div className="promo-content">
          <span className="promo-badge">Только до конца недели</span>
          
          <h1 className="promo-title">
            ДИКИЕ <span>СКИДКИ</span>
          </h1>
          
          <p className="promo-description">
            Хищные цены на все виды живого корма и аксессуары для террариумов. Дайте вашему питомцу лучшее без лишних трат.
          </p>
          
          <div className="promo-actions">
            <button className="promo-btn-primary">
              Забрать выгоду
            </button>
            <button className="promo-btn-secondary">
              Все акции
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reklama;