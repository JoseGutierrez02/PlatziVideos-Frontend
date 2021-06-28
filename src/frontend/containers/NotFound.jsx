import React from 'react';
import Header from '../components/Header';
import '../assets/styles/components/NotFound.scss';

const NotFound = () => (
  <>
    <Header isNotFound />
    <section className='not-found'>
      <div className='not-found__container'>
        <h1 className='animated pulse'>404</h1>
        <p>Página no encontrada</p>
      </div>
    </section>
  </>
);

export default NotFound;
