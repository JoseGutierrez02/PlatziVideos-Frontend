import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { searchRequest } from '../actions';
import '../assets/styles/components/Search.scss';

const Search = (props) => {
  const { isHome } = props;
  const inputStyle = classNames('search__input', {
    isHome,
  });

  const handleInput = (event) => {
    props.searchRequest(event.target.value);
  };
  return (
    <section className='search'>
      <h2 className='search__title'>¿Qué quieres ver hoy?</h2>
      <input 
        aria-label='Buscar' 
        className={inputStyle} 
        type='text' 
        placeholder='Buscar...' 
        onChange={handleInput}
      />
    </section>
  );
};

const mapDispatchToProps = {
  searchRequest,
};

export default connect(null, mapDispatchToProps)(Search);
