import React, { useReducer,  useEffect, useCallback, useMemo } from 'react';

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from '../../hooks/http'

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET': 
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}


const  Ingredients= () =>  {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp()

  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  
  
  useEffect(()=> {
    if (!isLoading && !error) {
      switch(reqIdentifier) {
        case 'REMOVE_INGREDIENT':
          dispatch({type: 'DELETE', id: reqExtra})
          break
        case 'ADD_INGREDIENT':
            dispatch ({type: 'ADD', 
          ingredient: {id: data.name, ...reqExtra} 
        })
        break
        default:
          break
      }  
    }

  }, [data, reqExtra, reqIdentifier, error, isLoading])   // run only when userIngredients changes

  const addIngredientHandler = useCallback(ingredient => {
        sendRequest('https://react-hook-update-b9294.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT')
      }, 
      [sendRequest]);

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients})
    //setUserIngredients(filteredIngredients)
  }, [])

  const removeIngredientHandler = useCallback(id => {
    sendRequest(`https://react-hook-update-b9294.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'REMOVE_INGREDIENT')
  }, [sendRequest]);


  const ingredientsList = useMemo (() => (<IngredientList
    onRemoveItem={removeIngredientHandler}
    ingredients={userIngredients}
  />), [userIngredients, removeIngredientHandler])
  
  
  
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> {error}</ErrorModal>}
      <IngredientForm onAddIngredients={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
          {ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
