import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import RecipesProvider from './contexts/RecipesProvider';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MainPage from './pages/MainPage';
import Drinks from './pages/Drinks';
import Explore from './pages/Explore';
import ExploreFoods from './pages/ExploreFoods';
import ExploreDrinks from './pages/ExploreDrinks';
import ExploreFoodsByIngredients from './pages/ExploreFoodsByIngredients';
import ExploreDrinksByIngredients from './pages/ExploreDrinksByIngredients';
import FavoriteRecipes from './pages/FavoriteRecipes';
import RecipesDone from './pages/RecipesDone';
import DrinkById from './pages/DrinkById';
import FoodById from './pages/FoodById';
import FoodByIdInProgress from './pages/FoodByIdInProgress';
import DrinkByIdInProgress from './pages/DrinkByIdInProgress';
import FoodByArea from './pages/ExploreFoodByArea';
import NotFound from './pages/NotFound';

function App() {
  return (
    <RecipesProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route path="/perfil" component={ Profile } />
          <Route exact path="/comidas" component={ MainPage } />
          <Route exact path="/bebidas" component={ Drinks } />
          <Route exact path="/explorar" component={ Explore } />
          <Route exact path="/explorar/comidas" component={ ExploreFoods } />
          <Route exact path="/explorar/bebidas" component={ ExploreDrinks } />
          <Route exact path="/comidas/:foodId" component={ FoodById } />
          <Route exact path="/bebidas/:drinkId" component={ DrinkById } />
          <Route path="/comidas/:foodId/in-progress" component={ FoodByIdInProgress } />
          <Route path="/bebidas/:drinkId/in-progress" component={ DrinkByIdInProgress } />
          <Route
            exact
            path="/explorar/comidas/ingredientes"
            component={ ExploreFoodsByIngredients }
          />
          <Route
            exact
            path="/explorar/bebidas/ingredientes"
            component={ ExploreDrinksByIngredients }
          />
          <Route path="/explorar/comidas/area" component={ FoodByArea } />
          <Route path="/receitas-feitas" component={ RecipesDone } />
          <Route path="/receitas-favoritas" component={ FavoriteRecipes } />
          <Route path="*" component={ NotFound } />
        </Switch>
      </BrowserRouter>

    </RecipesProvider>

  );
}

export default App;
