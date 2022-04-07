import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import copy from 'clipboard-copy';
import '../styles/recommended.css';
import setInProgressRecipesLocalStorage from '../helpers/helpers';

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
    const favoriteDrink = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const alreadyFavorite = favoriteDrink.some(
      (favoriteRecipe) => favoriteRecipe.id === drink.idDrink,
    );
    if (alreadyFavorite) {
      const newFavorites = favoriteDrink.filter(
        (favoriteRecipe) => favoriteRecipe.id !== drink.idDrink,
      );
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    } else {
      favoriteDrink.push(recipe);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteDrink));
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
      cocktails: { [recipeId]: [ingredientId] },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else if (!inProgressRecipes.cocktails) { // localStorage apenas com bebidas -
    const newProgressRecipes = {
      ...inProgressRecipes,
      cocktails: { [recipeId]: [ingredientId] },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else if (!inProgressRecipes.cocktails[recipeId]) { // localStorage sem essa receita - funciona
    const newProgressRecipes = {
      ...inProgressRecipes,
      cocktails: {
        ...inProgressRecipes.cocktails,
        [recipeId]: [ingredientId],
      },
    };
    setInProgressRecipesLocalStorage(newProgressRecipes);
  } else { // o id já está salvo
    const recipeIngredients = inProgressRecipes.cocktails[recipeId];
    const isIngredientDone = recipeIngredients
      .some((ingredientNumber) => parseInt(ingredientNumber, 10) === ingredientId);
    if (isIngredientDone) { // ingrediente já está salvo
      const arrayIds = recipeIngredients
        .filter((ingredientNumber) => parseInt(ingredientNumber, 10) !== ingredientId);
      const newProgressRecipes = {
        ...inProgressRecipes,
        cocktails: { ...inProgressRecipes.cocktails, [recipeId]: [...arrayIds] },
      };
      setInProgressRecipesLocalStorage(newProgressRecipes);
    } else { // ingrediente não está salvo
      const arrayIds = [...recipeIngredients, ingredientId];
      const newProgressRecipes = {
        ...inProgressRecipes,
        cocktails: {
          ...inProgressRecipes.cocktails,
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
  console.log(inProgressRecipes);
  const savedIngredients = inProgressRecipes ? inProgressRecipes.cocktails[id] : [];
  if (savedIngredients) {
    callbackIngredients(savedIngredients);
  }
}

export default function DrinkByIdInProgress({ match }) {
  const { drinkId: id } = match.params;
  const [drink, setDrink] = useState({});
  const [alert, setAlert] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [ingredientsSaved,
    setIngredientsSaved] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getFavorites(setIngredientsSaved, setFavorite, id);
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
        <h2 data-testid="recipe-category">{drink.strCategory}</h2>
        <h2 data-testid="recipe-title">{drink.strDrink}</h2>
        <img
          data-testid="recipe-photo"
          alt={ drink.strDrink }
          src={ drink.strDrinkThumb }
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
              )
          ))}
        </div>
        <div data-testid="instructions">{drink.strInstructions}</div>
        <input
          type="image"
          onClick={ () => {
            copy(`http://localhost:3000/bebidas/${id}`);
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

DrinkByIdInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      drinkId: PropTypes.string,
    }),
  }).isRequired,
};
