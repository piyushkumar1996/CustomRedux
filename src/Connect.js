import React, { useContext, useEffect, useRef, useReducer } from 'react'
import { GlobalContext } from './ReduxProvider';

// Shallow equality check utility
const shallowEqual = (objA, objB) => {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
};

const Connect = (mstp, mdtp) => (Component) => {

    return (props) => {
        const store = useContext(GlobalContext);
        const stateProps = mstp(store.getState());
        const previousStateRef = useRef(stateProps);
        const [_, forComponentUpdate] = useReducer(x => x + 1, 0)

        const dispatchProps = mdtp(store.dispatch);

        const enhancedProps = {...stateProps, ...dispatchProps, ...props}

        useEffect(() => {
            const unsubscribe = store.subscribe(() => {
                const newState = mstp(store.getState());

                if(!shallowEqual(newState, previousStateRef.current)){
                    previousStateRef.current = newState;
                    // force component update
                    forComponentUpdate()
                }
            })

            return () => {
                unsubscribe()
            }
        }, [store])

        return <Component {...enhancedProps} />
    }
}

export default Connect;