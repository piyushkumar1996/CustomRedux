# Custom Redux

A lightweight, custom Redux-like state management library for React applications. This package provides a predictable state container with unidirectional data flow, following the Redux pattern.

## Features

- ✅ **Predictable State Container** - Single source of truth for application state
- ✅ **Unidirectional Data Flow** - Clear data flow pattern: store → UI → dispatch → action → reducer → store
- ✅ **Pure Reducers** - State updates through pure functions
- ✅ **Pub-Sub Pattern** - Store subscription mechanism for reactive updates
- ✅ **React Integration** - Seamless integration with React components via `Provider` and `Connect`
- ✅ **Middleware Support** - Support for thunk-like middleware functions
- ✅ **Shallow Equality** - Optimized re-renders using shallow equality checks
- ✅ **TypeScript Ready** - Works with TypeScript projects
- ✅ **Dual Format** - Supports both CommonJS and ES Modules

## Installation

```bash
npm install @uilib/custom-redux
```

**Note:** This package requires React 17 or higher as a peer dependency.

## Quick Start

### 1. Create a Store

```javascript
import { createStore, combineReducers } from '@uilib/custom-redux';

// Define a reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Combine multiple reducers (optional)
const rootReducer = combineReducers({
  counter: counterReducer,
  // ... other reducers
});

// Create the store
const store = createStore(rootReducer, { counter: { count: 0 } });
```

### 2. Setup Provider

```javascript
import React from 'react';
import { Provider } from '@uilib/custom-redux';
import App from './App';

function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
```

### 3. Connect Components

```javascript
import React from 'react';
import { Connect } from '@uilib/custom-redux';

// Map state to props
const mapStateToProps = (state) => ({
  count: state.counter.count
});

// Map dispatch to props
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: 'INCREMENT' }),
  decrement: () => dispatch({ type: 'DECREMENT' })
});

// Component
const Counter = ({ count, increment, decrement }) => (
  <div>
    <h1>Count: {count}</h1>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);

// Connect component to store
export default Connect(mapStateToProps, mapDispatchToProps)(Counter);
```

## API Reference

### `createStore(reducer, initialState, middleware)`

Creates a Redux store that holds the complete state tree of your app.

**Parameters:**
- `reducer` (Function): A reducing function that returns the next state tree
- `initialState` (Object, optional): The initial state tree
- `middleware` (Function, optional): Middleware function for handling thunk actions

**Returns:**
- An object with the following methods:
  - `getState()`: Returns the current state tree
  - `dispatch(action)`: Dispatches an action to change the state
  - `subscribe(listener)`: Subscribes to store changes, returns unsubscribe function

**Example:**
```javascript
const store = createStore(reducer, { count: 0 });

// Get current state
const state = store.getState();

// Dispatch an action
store.dispatch({ type: 'INCREMENT' });

// Subscribe to changes
const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});
```

### `combineReducers(reducers)`

Combines multiple reducers into a single reducer function.

**Parameters:**
- `reducers` (Object): An object whose values are reducer functions

**Returns:**
- A reducer function that calls every child reducer and gathers their results into a single state object

**Example:**
```javascript
const rootReducer = combineReducers({
  todos: todosReducer,
  counter: counterReducer,
  user: userReducer
});
```

### `<Provider store={store}>`

Makes the Redux store available to the component tree.

**Props:**
- `store` (Object): The Redux store object

**Example:**
```javascript
<Provider store={store}>
  <App />
</Provider>
```

### `Connect(mapStateToProps, mapDispatchToProps)`

Higher-order component that connects a React component to the Redux store.

**Parameters:**
- `mapStateToProps` (Function): Maps state to component props
  - `(state) => ({ ... })`
- `mapDispatchToProps` (Function): Maps dispatch to component props
  - `(dispatch) => ({ ... })`

**Returns:**
- A higher-order component that wraps your component

**Example:**
```javascript
const ConnectedComponent = Connect(
  (state) => ({ data: state.data }),
  (dispatch) => ({ 
    fetchData: () => dispatch({ type: 'FETCH_DATA' })
  })
)(MyComponent);
```

### `GlobalContext`

React Context object used internally by the Provider. Can be used directly with `useContext` if needed.

## Middleware Support

The store supports thunk-like middleware for handling async actions:

```javascript
const thunkMiddleware = (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return action;
};

const store = createStore(reducer, initialState, thunkMiddleware);

// Now you can dispatch functions
store.dispatch((dispatch, getState) => {
  setTimeout(() => {
    dispatch({ type: 'ASYNC_ACTION' });
  }, 1000);
});
```

## Complete Example

```javascript
// store.js
import { createStore, combineReducers } from '@uilib/custom-redux';

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload }];
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  todos: todosReducer
});

export const store = createStore(rootReducer, { todos: [] });
```

```javascript
// App.js
import React from 'react';
import { Provider } from '@uilib/custom-redux';
import { store } from './store';
import TodoList from './TodoList';

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}
```

```javascript
// TodoList.js
import React from 'react';
import { Connect } from '@uilib/custom-redux';

const TodoList = ({ todos, addTodo, removeTodo }) => {
  const [input, setInput] = React.useState('');

  const handleAdd = () => {
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={handleAdd}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  todos: state.todos
});

const mapDispatchToProps = (dispatch) => ({
  addTodo: (text) => dispatch({ type: 'ADD_TODO', payload: text }),
  removeTodo: (id) => dispatch({ type: 'REMOVE_TODO', payload: id })
});

export default Connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

## How It Works

1. **Store**: Single source of truth holding the application state
2. **Actions**: Plain objects describing what happened (`{ type: 'ACTION_TYPE', payload: ... }`)
3. **Reducers**: Pure functions that take current state and action, return new state
4. **Dispatch**: Method to send actions to the store
5. **Subscribe**: Method to listen for state changes
6. **Provider**: React component that makes the store available via Context
7. **Connect**: HOC that connects components to the store with shallow equality optimization

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

