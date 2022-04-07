import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import RecipesContext from '../contexts/RecipesContext';
import '../styles/buttons.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  fetchFoodOnLoad,
  fetchFoodCategories,
  fetchFoodByCategories } from '../services/comidasApi';

export default function MainPage() {
  const { mealsData } = useContext(RecipesContext);
  const [meals, setMeals] = useState(mealsData);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const history = useHistory();

  const MAX_NUM = 12;
  const FIVE = 5;

  useEffect(() => {
    async function handleMealsOnLoad() {
      if ((mealsData && mealsData.length === 0) || !mealsData) {
        const food = await fetchFoodOnLoad();
        setMeals(food);
      } else {
        setMeals(mealsData);
      }
    }
    handleMealsOnLoad();

    async function handleCategories() {
      const dataCategories = await fetchFoodCategories();
      setCategories(dataCategories);
    }
    handleCategories();
  }, [mealsData]);

  async function renderRecipes(category) {
    if (category === filterCategory) {
      const dataCategories = await fetchFoodOnLoad();
      setFilterCategory('');
      return setMeals(dataCategories);
    }
    const dataRecipes = await fetchFoodByCategories(category);
    setFilterCategory(category);
    setMeals(dataRecipes);
  }

  async function renderAllRecipes() {
    const dataCategories = await fetchFoodOnLoad();
    setFilterCategory('');
    return setMeals(dataCategories);
  }

  return (
    <div>
      <Header title="Comidas" />
      <button
        data-testid="All-category-filter"
        type="button"
        className="buttons"
        onClick={ renderAllRecipes }
      >
        All
      </button>
      {categories && categories.slice(0, FIVE).map((category) => (
        <button
          type="button"
          name="category"
          className="buttons"
          onClick={ () => renderRecipes(category.strCategory) }
          key={ category.strCategory }
          data-testid={ `${category.strCategory}-category-filter` }
        >
          {category.strCategory}
        </button>))}
      <div className="cards">
        { meals && meals.slice(0, MAX_NUM).map((elem, index) => (
          <div
            tabIndex={ 0 } // SOURCE: encurtador.com.br/bjqHQ
            role="button"
            onKeyDown={ () => (history.push(`/comidas/${elem.idMeal}`)) }
            onClick={ () => (history.push(`/comidas/${elem.idMeal}`)) }
            data-testid={ `${index}-recipe-card` }
            key={ elem.idMeal }
          >
            <img
              data-testid={ `${index}-card-img` }
              src={ elem.strMealThumb }
              alt="Imagem da receita"
              width="200"
            />
            <h3
              data-testid={ `${index}-card-name` }
            >
              { elem.strMeal }
            </h3>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
