import React from 'react';
import "./style/Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="footer-logo-icon">O</div>
              <span className="footer-logo-text">ГАМА</span>
            </div>
            <p className="footer-desc">
              Лучшие товары для ваших любимых питомцев с доставкой до двери.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Навигация</h4>
            <div className="footer-links">
              <a href="#">Помощь</a>
              <a href="#">Доставка</a>
              <a href="#">Сертификаты</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Контакты</h4>
            <p className="footer-contact">info@agama-pet.ru</p>
            <p className="footer-phone">8 (800) 555-35-35</p>
          </div>
          <div>
            <h4 className="footer-title">Мы в соцсетях</h4>
            <div className="footer-social">
              {['VK', 'TG', 'OK'].map(social => (
                <div key={social} className="social-btn">{social}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;