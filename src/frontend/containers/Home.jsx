import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { searchRequest, setError } from '../actions';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import '../assets/styles/App.scss';

const Home = ({ myList, trends, originals, search, searchRequest, setError, error }) => {
  const [alert, setAlert] = useState(false);
  const hasSearch = search.length > 0;
  const isList = myList.length > 0;
  useEffect(() => { 
    if (hasSearch) searchRequest('');
  }, []);

  useEffect(() => {
    if (error && error.info) {
      setAlert(true);
    }
  }, [error]);

  const handleConfirm = () => {
    setError('');
    setAlert(false);
  };

  return (
    <>
      <SweetAlert
        title='Whoops!'
        onConfirm={handleConfirm}
        show={alert}
        customButtons={
          <button 
            className='dismiss-alert-button' 
            onClick={handleConfirm}
          >
            OK
          </button>
        }
      >
        {error && error.info ? error.info : 'Ha habido un error'}
      </SweetAlert>

      <Header />
      <Search isHome />

      {hasSearch &&
        <Categories title='Resultados'>
          <Carousel>
            {search.map((item) => 
              <CarouselItem key={item.id} {...item} />,
            )}
          </Carousel>
        </Categories>
      }

      {isList > 0 &&
        <Categories title='Mi lista'>
          <Carousel>
            {myList.map((item) => 
              <CarouselItem 
                key={item.id} 
                {...item} 
                isList
              />,
            )}
          </Carousel>
        </Categories>
      }

      <Categories title='Tendencias'>
        <Carousel>
          {trends.map((item) => 
            <CarouselItem key={item.id} {...item} />,
          )}
        </Carousel>
      </Categories>

      <Categories title='Originales de Platzi Video'>
        <Carousel>
          {originals.map((item) => 
            <CarouselItem key={item.id} {...item} />,
          )}
        </Carousel> 
      </Categories>
    </>
  );
};

const mapStateToProps = ({ myList, trends, originals, search, error }) => ({
  myList,
  trends,
  originals,
  search,
  error,
});

const mapDispatchToProps = {
  searchRequest,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
