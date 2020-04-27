import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import useHttp from '../../hooks/http'
import './Search.css';
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo( ({ onLoadIngredients }) => {
  const [enteredFiltered, setEnteredFilter] = useState('')
  const newEnteredFilterRef = useRef()
  const { isLoading, error, data, sendRequest,  clear } = useHttp()

  useEffect(() => {

    const timer = setTimeout(() => {
      if (enteredFiltered === newEnteredFilterRef.current.value) {
        const query = enteredFiltered.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFiltered}"`
        sendRequest('https://react-hook-update-b9294.firebaseio.com/ingredients.json' + query, 'GET')    
      }  
    }, 500)
     return () => {
       clearTimeout(timer)
     }
    },
  [enteredFiltered, newEnteredFilterRef, sendRequest])
    useEffect(() => {
      if (!isLoading && !error && data) {
        const loaedIngredients = []
        for(const key in data) {
          loaedIngredients.push({
            id: key,
            ...data[key]
          })
        }
          // set something to ingredients
        onLoadIngredients(loaedIngredients)
      }

    }, [data, isLoading, error, onLoadIngredients])
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading ...</span>}
          <input ref={newEnteredFilterRef} type="text" value={enteredFiltered} onChange={e => setEnteredFilter(e.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
