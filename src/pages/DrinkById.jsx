import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import copy from 'clipboard-copy';
import RecommendedRecipes from '../components/RecommendedRecipes';
import { fetchRecommendedMeals } from '../services/comidasApi';

const { log } = console;
function handleFavoriteButtonClick(id, drink, favorite, setFavorite) {
  const recipe = {
    id,
    type: 'bebida',
    area: '',
    category: drink.strCategory,
    alcoholicOrNot: drink.strAlcoholic,
    name: drink.strDrink,
    image: drink.strDrinkThumb };

  if (!JSON.parse(localStorage.getItem('favoriteRecipes'))
      || JSON.parse(localStorage.getItem('favoriteRecipes')) === 0) {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
  } else {
    const favoriteFoods = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const alreadyFavorite = favoriteFoods.some(
      (favoriteRecipe) => favoriteRecipe.id === id,
    );
    if (alreadyFavorite) {
      const newFavorites = favoriteFoods.filter(
        (favoriteRecipe) => favoriteRecipe.id !== id,
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
export default function DrinkById({ match }) {
  const { drinkId: id } = match.params;
  const history = useHistory();
  const location = useLocation();
  const index = 0;
  const [drink, setDrink] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [alert, setAlert] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes !== null && favoriteRecipes.some((recipe) => recipe.id === id)) {
      setFavorite(true);
    }
  }, [id]);

  const ingredients = Object.keys(drink)
    .filter((ingredient) => ingredient.includes('strIngredient'))
    .map((ingredient) => drink[ingredient]);

  const measures = Object.keys(drink)
    .filter((measure) => measure.includes('strMeasure'))
    .map((measure) => drink[measure]);

  useEffect(() => {
    const fetchById = async () => {
      try {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const json = await res.json();
        const drinkRecipe = json.drinks[0];
        setDrink(drinkRecipe);
        return drinkRecipe;
      } catch (error) {
        console.log('ERRO DE REQUISIÇÃO', error);
      }
    };

    async function fetchByRecommendedMeal() {
      const recommendation = await fetchRecommendedMeals();
      setRecommended(recommendation);
    }

    fetchById();
    fetchByRecommendedMeal();
  }, [id]);

  function displayAlert() {
    const THREE = 3000;
    setTimeout(() => setAlert(false), THREE);
    return <span><i>Link copiado!</i></span>;
  }
  function putRecipeInStorage() {
    const local = JSON.parse(localStorage.getItem('inProgressRecipes'));
    log(local);
    if (!local) {
      const object = { cocktails: { [id]: [] } };
      return localStorage.setItem('inProgressRecipes', JSON.stringify(object));
    }
    if (!local.cocktails) {
      local.cocktails = { [id]: [] };
      return localStorage.setItem('inProgressRecipes', JSON.stringify(local));
    }
    local.cocktails[id] = [];
    return localStorage.setItem('inProgressRecipes', JSON.stringify(local));
  }

  return (
    <div className="page-container">
      <div>
        <h2 data-testid="recipe-category">{drink.strCategory}</h2>
        <h2 data-testid="recipe-category">{drink.strAlcoholic}</h2>
        <h2 data-testid="recipe-title">{drink.strDrink}</h2>
        <img
          data-testid="recipe-photo"
          alt={ drink.strDrink }
          src={ drink.strDrinkThumb }
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
        <div data-testid="instructions">{drink.strInstructions}</div>
        <button
          type="button"
          className="start-recipe"
          data-testid="start-recipe-btn"
          onClick={ () => {
            putRecipeInStorage();
            history.push(`/bebidas/${id}/in-progress`);
          } }
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
          onClick={ () => handleFavoriteButtonClick(id, drink, favorite, setFavorite) }
          alt="heart"
          src={
            favorite ? '/images/blackHeartIcon.svg' : '/images/whiteHeartIcon.svg'
          }
        />
        <div className="recommended-container">
          <RecommendedRecipes index={ index } recommended={ recommended } type="drink" />
        </div>
      </div>
    </div>
  );
}

DrinkById.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      drinkId: PropTypes.string,
    }),
  }).isRequired,
};
