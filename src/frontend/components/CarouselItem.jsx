import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../actions';
import '../assets/styles/components/CarouselItem.scss';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';

const CarouselItem = (props) => {
  const { 
    _id, cover, title, year, contentRating, duration, isList, user, userMovieId,
  } = props;

  const handleSetFavorite = () => {
    props.addFavorite(user.id, {
      _id, cover, title, year, contentRating, duration,
    });
  };

  const handleDeleteFavorite = (itemId) => {
    props.removeFavorite(itemId);
  };

  return (
    <div className='carousel-item'>
      <img className='carousel-item__img' src={cover} alt={title} />
      <div className='carousel-item__details'>
        <div>
          <Link to={`/player/${_id}`}>
            <img 
              src={playIcon} 
              alt='Play'
            />
          </Link>
          {isList ?
            <img 
              src={removeIcon} 
              alt='Remove'
              onClick={() => handleDeleteFavorite(userMovieId)}
            /> :
            <img 
              src={plusIcon} 
              alt='Plus'
              onClick={handleSetFavorite}
            /> 
          }
        </div>
        <p className='carousel-item__details--title'>{title}</p>
        <p className='carousel-item__details--subtitle'>
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = {
  addFavorite,
  removeFavorite,
};

export default connect(mapStateToProps, mapDispatchToProps)(CarouselItem);
