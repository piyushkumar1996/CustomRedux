/* A predictable state container for js apps.
    1. Js object which is single source of truth
    2. It has uni directional data flow
    3. It has a certain way of updation using reducer which are pure function.
    4. It is based on the pubs-sub pattern
    5. Works in different envioronments

    store - UI - dispatch - action - reducer - store - new UI
*/

export const combineReducers = (reducers) => {
    const mainReducer = function (state, action) {
        let newStore = {}
        Object.keys(reducers).forEach(item => newStore[item] = reducers[item](state[item], action))
        return newStore
    }
    return mainReducer;
}

function createStore(reducer, initialState, middleware) {
    let rootReducer = reducer;
    let currentState = initialState;
    let listeners = [];

    const getState = () => {
        return currentState;
    }

    const subscribe = (listener) => {
        listeners.push(listener)

        const unSubscribe = () => {
            listeners = listeners.filter(item => item !== listener)
        }

        return unSubscribe
    }

    const dispatch = (action) => {

        if(middleware && typeof action === 'function'){
            return action(dispatch, getState)
        }

        if (typeof action !== 'object') {
            throw new Error('Action should be plain object');
        }

        if (typeof action.type === 'undefined') {
            throw new Error('Action must have a type');
        }

        const newState = rootReducer(currentState, action);
        currentState = newState
        listeners.forEach(listener => listener())
        return action
    }

    // To initialise the store
    dispatch({ type: '@INIT' })

    return {
        dispatch,
        subscribe,
        getState,
    }
}

export default createStore;