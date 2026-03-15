import Ogama_pic from "./image/ogamabann.png"

const About = () => {
  return (
    <section className="section" style={{ backgroundColor: '#fff' }}>
    
      <div className="container">
          <h2 className="section-title"> О нас</h2>
        <div className="about">
          <div className="about-img">
            <img 
              src={Ogama_pic} 
              alt="Agama Team"
            />
          </div>
          <div className="about-content">
            <span className="promo-badge" style={{ marginBottom: '12px' }}>Наша история</span>
            <h2 className="about-title" style={{ fontSize: '42px', color: '#064e3b' }}>
              Мир рептилий с <span>любовью</span>
            </h2>
            <p className="about-text">
              В <span>«ОГАМА»</span> мы создаем экосистему для ваших чешуйчатых друзей. Это не просто магазин, а сообщество экспертов, которые знают о террариумистике всё.
            </p>
            <div className="about-stats">
              <div className="stat-card green">
                <h4 className="stat-number">10+ лет</h4>
                <p className="stat-label">Опыта в экспертности</p>
              </div>
              <div className="stat-card orange">
                <h4 className="stat-number">5000+</h4>
                <p className="stat-label">Довольных владельцев</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;