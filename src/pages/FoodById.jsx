import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import copy from 'clipboard-copy';
import RecommendedRecipes from '../components/RecommendedRecipes';
import { fetchRecommendedDrinks } from '../services/bebidasApi';
import '../styles/recommended.css';

function handleFavoriteButtonClick(id, meal, favorite, setFavorite) {
  const recipe = {
    id,
    type: 'comida',
    area: meal.strArea,
    category: meal.strCategory,
    alcoholicOrNot: '',
    name: meal.strMeal,
    image: meal.strMealThumb };
  console.log(recipe);

  if (!JSON.parse(localStorage.getItem('favoriteRecipes'))
    || JSON.parse(localStorage.getItem('favoriteRecipes')) === 0) {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
  } else {
    const favoriteFoods = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const alreadyFavorite = favoriteFoods.some(
      (favoriteRecipe) => favoriteRecipe.id === meal.idMeal,
    );
    if (alreadyFavorite) {
      const newFavorites = favoriteFoods.filter(
        (favoriteRecipe) => favoriteRecipe.id !== meal.idMeal,
      );
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    } else {
      favoriteFoods.push(recipe);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteFoods));
    }
  }
  if (favorite === true) {
    return setFavorite(false);
  }
  setFavorite(true);
}
export default function FoodById({ match }) {
  const { foodId: id } = match.params;
  const history = useHistory();
  const location = useLocation();
  const index = 0;
  const [meal, setMeal] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [alert, setAlert] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes !== null && favoriteRecipes.some((recipe) => recipe.id === id)) {
      setFavorite(true);
    }
  }, [id]);

  const ingredients = Object.keys(meal)
    .filter((ingredient) => ingredient.includes('strIngredient'))
    .map((ingredient) => meal[ingredient]);

  const measures = Object.keys(meal)
    .filter((measure) => measure.includes('strMeasure'))
    .map((measure) => meal[measure]);

  useEffect(() => {
    const fetchById = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const json = await res.json();
        const mealRecipe = json.meals[0];
        setMeal(mealRecipe);
        return mealRecipe;
      } catch (error) {
        console.log('error', error);
      }
    };

    async function fetchByRecommendedDrink() {
      const recommendation = await fetchRecommendedDrinks();
      setRecommended(recommendation);
    }

    fetchById();
    fetchByRecommendedDrink();
  }, [id]);

  function displayAlert() {
    const THREE = 3000;
    setTimeout(() => setAlert(false), THREE);
    return <span><i>Link copiado!</i></span>;
  }

  return (
    <div className="page-container">
      <div>
        <h2 data-testid="recipe-category">{meal.strCategory}</h2>
        <h2 data-testid="recipe-title">{meal.strMeal}</h2>
        <img
          data-testid="recipe-photo"
          alt={ meal.strMeal }
          src={ meal.strMealThumb }
          width="200"
        />
        {ingredients.map((ingredient, i) => (
          (ingredient === '' || ingredient === null)
            ? null
            : (
              <li
                key={ `${ingredient}-${i}` }
                data-testid={ `${i}-ingredient-name-and-measure` }
              >
                {`${ingredient} - ${measures[i]}`}
              </li>
            )
        ))}
        <div data-testid="instructions">{meal.strInstructions}</div>
        <h3>Vídeo</h3>
        <iframe
          width="340"
          height="200"
          title={ meal.strMeal }
          src={ meal.strYoutube }
          data-testid="video"
        />
        <button
          type="button"
          className="start-recipe"
          data-testid="start-recipe-btn"
          onClick={ () => { history.push(`/comidas/${id}/in-progress`); } }
        >
          Iniciar Receita
        </button>
        <input
          type="image"
          onClick={ () => {
            copy(`http://localhost:3000${location.pathname}`);
            setAlert(true);
          } }
          alt="share-content"
          data-testid="share-btn"
          src="/images/shareIcon.svg"
        />
        {alert && displayAlert()}
        <input
          type="image"
          data-testid="favorite-btn"
          onClick={ () => handleFavoriteButtonClick(id, meal, favorite, setFavorite) }
          alt="heart"
          src={
            favorite ? '/images/blackHeartIcon.svg' : '/images/whiteHeartIcon.svg'
          }
        />
        <div className="recommended-container">
          <RecommendedRecipes
            index={ index }
            recommended={ recommended }
            type="meal"
          />
        </div>
      </div>
    </div>
  );
}

FoodById.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      foodId: PropTypes.string,
    }),
  }).isRequired,
};
