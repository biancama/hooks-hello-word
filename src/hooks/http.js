import { useReducer, useCallback } from 'react'
const initialState = {
    isLoading: false, error: null, data: null, extra: null, identifier: null
}

const httpReducer = (currHttpState, action) => {
    switch(action.type) {
      case 'SEND': 
        return {isLoading: true, error: null, data: null, extra: null, identifier: action.identifier}
      case 'RESPONSE':
        return {...currHttpState, isLoading: false, data: action.responseData, extra: action.extra}
      case 'CLEAR': 
          return initialState;
      case 'ERROR':
        return {isLoading: false, error: action.error}
      default:
        throw new Error('Should not get there!')
    }
  }
  

const useHttp = () => {
    
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)
    
    const clear = () => dispatchHttp({ type: 'CLEAR' })
    const sendRequest = useCallback((url, method , body, reqExtra, reqIdentifier ) => {
        dispatchHttp({type: 'SEND', identifier: reqIdentifier})
        fetch(
            url, 
            {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(response =>{
                dispatchHttp({type: 'RESPONSE', responseData: response, extra: reqExtra})
            })
            .catch(err => {
            dispatchHttp({type: 'ERROR', error: 'Something went wrong'})
            })
    }, [])

    return {
        isLoading: httpState.isLoading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    }

}


export default useHttp;