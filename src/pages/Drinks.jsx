import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import RecipesContext from '../contexts/RecipesContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/buttons.css';
import {
  fetchDrinkOnLoad,
  fetchDrinkCategories,
  fetchDrinkByCategories } from '../services/bebidasApi';

export default function Drinks() {
  const { drinksData } = useContext(RecipesContext);
  const [drinks, setDrinks] = useState(drinksData);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const MAX_NUM = 12;
  const FIVE = 5;
  const history = useHistory();

  useEffect(() => {
    async function handleDrinksOnLoad() {
      if ((drinksData && drinksData.length === 0) || !drinksData) {
        const dataDrinks = await fetchDrinkOnLoad();
        setDrinks(dataDrinks);
      } else {
        setDrinks(drinksData);
      }
    }
    handleDrinksOnLoad();

    async function handleCategories() {
      const dataCategories = await fetchDrinkCategories();
      setCategories(dataCategories);
    }
    handleCategories();
  }, [drinksData]);

  async function renderRecipes(category) {
    if (category === filterCategory) {
      const dataCategories = await fetchDrinkOnLoad();
      setFilterCategory('');
      return setDrinks(dataCategories);
    }
    const dataRecipes = await fetchDrinkByCategories(category);
    setFilterCategory(category);
    setDrinks(dataRecipes);
  }

  async function renderAllRecipes() {
    const dataCategories = await fetchDrinkOnLoad();
    setFilterCategory('');
    return setDrinks(dataCategories);
  }

  return (
    <div>
      <Header title="Bebidas" />
      <button
        data-testid="All-category-filter"
        type="button"
        className="btn buttons"
        onClick={ renderAllRecipes }
      >
        All
      </button>
      {categories && categories.slice(0, FIVE).map((category) => (
        <button
          type="button"
          name="category"
          value={ category.strCategory }
          className="btn buttons"
          onClick={ () => renderRecipes(category.strCategory) }
          key={ category.strCategory }
          data-testid={ `${category.strCategory}-category-filter` }
        >
          {category.strCategory}
        </button>))}
      { drinks && drinks.slice(0, MAX_NUM).map((elem, index) => (
        <div
          data-testid={ `${index}-recipe-card` }
          key={ elem.idDrink }
          tabIndex={ 0 } // SOURCE: encurtador.com.br/bjqHQ
          role="button"
          onKeyDown={ () => (history.push(`/bebidas/${elem.idDrink}`)) }
          onClick={ () => (history.push(`/bebidas/${elem.idDrink}`)) }
        >
          <img
            data-testid={ `${index}-card-img` }
            src={ elem.strDrinkThumb }
            alt="drinksCard"
            width="200"
          />
          <h3
            data-testid={ `${index}-card-name` }
          >
            { elem.strDrink }
          </h3>
        </div>
      ))}
      <Footer />
    </div>
  );
}
