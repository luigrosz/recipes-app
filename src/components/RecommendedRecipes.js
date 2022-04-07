import React from 'react';
import PropTypes from 'prop-types';
import '../styles/buttons.css';

export default function RecommendedRecipes({ recommended, type }) {
  const MAX_RECOMMENDED = 6;
  if (type === 'meal') {
    return (
      <div className="recommended-card">
        {
          recommended && recommended.slice(0, MAX_RECOMMENDED).map((rec, i) => (
            <div key={ rec.strDrink } data-testid={ `${i}-recomendation-card` }>
              <h2>{rec.strCategory}</h2>
              <h2 data-testid={ `${i}-recomendation-title` }>{rec.strDrink}</h2>
              <img src={ rec.strDrinkThumb } width="200" alt={ rec.strDrink } />
            </div>))
        }
      </div>
    );
  }
  return (
    <div className="recommended-card">
      {
        recommended && recommended.slice(0, MAX_RECOMMENDED).map((rec, i) => (
          <div key={ rec.strMeal } data-testid={ `${i}-recomendation-card` }>
            <h2>{rec.strCategory}</h2>
            <h2 data-testid={ `${i}-recomendation-title` }>{rec.strMeal}</h2>
            <img src={ rec.strMealThumb } width="200" alt={ rec.strMeal } />
          </div>))
      }
    </div>
  );
}

RecommendedRecipes.propTypes = {
  recommended: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
};
