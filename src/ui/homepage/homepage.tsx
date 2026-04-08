import React from 'react';
import Header from '../../entity/Header_lizard';
import Reklama from '../../entity/Reklama';
import Categories from './section/Catigories';
import Offers from './section/Offers';
import About from './section/About';
import Footer from '../../entity/Footer';
import "./style/Homepage.css"
const HomePage = () => {
  return (
    <>
      <Header/>
      <Reklama/>
      <Categories/>
      <Offers/>
      <About/>
      <Footer/>
    </>
  );
};

export default HomePage;