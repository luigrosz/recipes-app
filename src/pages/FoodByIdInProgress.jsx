import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import '../styles/recommended.css';
import setInProgressRecipesLocalStorage from '../helpers/helpers';

function handleFavoriteButtonClick(id, meal, favorite, setFavorite) {
  const recipe = {
    id,
    type: 'comida',
    area: meal.strArea,
    category: meal.strCategory,
    alcoholicOrNot: '',
    name: meal.strMeal,
    image: meal.strMealThumb };

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

function validateButton(setIsDisable) {
  const checkboxInputs = Array.from(document.querySelectorAll('.ingredient-step'));
  const check = checkboxInputs.every((input) => input.checked === true);
  setIsDisable(!check);
}

function saveProcess(ingredientId, recipeId) {
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  if (!inProgressRecipes) { // localStorage vazio - funciona
    const newProgressRecipes = {
      meals: { [recipeId]: [ingredientId] },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else if (!inProgressRecipes.meals) { // localStorage apenas com bebidas -
    const newProgressRecipes = {
      ...inProgressRecipes,
      meals: { [recipeId]: [ingredientId] },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else if (!inProgressRecipes.meals[recipeId]) { // localStorage sem essa receita - funciona
    const newProgressRecipes = {
      ...inProgressRecipes,
      meals: {
        ...inProgressRecipes.meals,
        [recipeId]: [ingredientId],
      },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else { // o id já está salvo
    const recipeIngredients = inProgressRecipes.meals[recipeId];
    const isIngredientDone = recipeIngredients
      .some((ingredientNumber) => parseInt(ingredientNumber, 10) === ingredientId);
    if (isIngredientDone) { // ingrediente já está salvo
      const arrayIds = recipeIngredients
        .filter((ingredientNumber) => parseInt(ingredientNumber, 10) !== ingredientId);
      const newProgressRecipes = {
        ...inProgressRecipes,
        meals: { ...inProgressRecipes.meals, [recipeId]: [...arrayIds] },
      };
      setInProgressRecipesLocalStorage(newProgressRecipes);
    } else { // ingrediente não está salvo
      const arrayIds = [...recipeIngredients, ingredientId];
      const newProgressRecipes = {
        ...inProgressRecipes,
        meals: {
          ...inProgressRecipes.meals,
          [recipeId]: [...arrayIds],
        },
      };
      setInProgressRecipesLocalStorage(newProgressRecipes);
    }
  }
}

function checkIngredient({ target }, setIsDisable, index, id) {
  if (target.checked) {
    target.parentNode.style = 'text-decoration: line-through';
  } else {
    target.parentNode.style = 'text-decoration: none';
  }
  validateButton(setIsDisable);
  saveProcess(index, id);
}

function getFavorites(callbackIngredients, callbackFavorite, id) {
  const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (favoriteRecipes !== null && favoriteRecipes.some((recipe) => recipe.id === id)) {
    callbackFavorite(true);
  }
  const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const savedIngredients = inProgressRecipes ? inProgressRecipes.meals[id] : [];
  if (savedIngredients) {
    callbackIngredients(savedIngredients);
  }
}

export default function FoodByIdInProgress({ match }) {
  const { foodId: id } = match.params;
  const [meal, setMeal] = useState({});
  const [alert, setAlert] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [ingredientsSaved,
    setIngredientsSaved] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getFavorites(setIngredientsSaved, setFavorite, id);
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
    fetchById();
  }, [id]);

  function displayAlert() {
    const THREE = 3000;
    setTimeout(() => setAlert(false), THREE);
    return <span><i>Link copiado!</i></span>;
  }

  const styles = {
    checked: { textDecoration: 'line-through' },
    unchecked: { textDecoration: '' },
  };

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
        <div className="ingredient-list">
          {ingredients.map((ingredient, i) => (
            (ingredient === '' || ingredient === null)
              ? null
              : (
                <div className="ingredient-container" key={ `${ingredient}-${i}` }>
                  <label
                    data-testid={ `${i}-ingredient-step` }
                    htmlFor={ ingredient }
                    style={ ingredientsSaved
                      .some((ingredientId) => parseInt(ingredientId, 10) === i)
                      ? styles.checked : styles.unchecked }
                  >
                    <input
                      onClick={ (event) => checkIngredient(event, setIsDisable, i, id) }
                      id={ ingredient }
                      type="checkbox"
                      className="ingredient-step"
                      defaultChecked={ ingredientsSaved
                        .some((ingredientId) => parseInt(ingredientId, 10) === i) }
                    />
                    {
                      (measures[i] === '' || !measures[i])
                        ? ingredient
                        : `${ingredient} - ${measures[i]}`
                    }
                  </label>
                </div>
              )))}
        </div>
        <div data-testid="instructions">{meal.strInstructions}</div>
        <input
          type="image"
          onClick={ () => {
            copy(`http://localhost:3000/comidas/${id}`);
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
        <button
          type="button"
          data-testid="finish-recipe-btn"
          disabled={ isDisable }
          onClick={ () => history.push('/receitas-feitas') }
        >
          Finalizar Receita
        </button>
      </div>
    </div>
  );
}

FoodByIdInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      foodId: PropTypes.string,
    }),
  }).isRequired,
};
